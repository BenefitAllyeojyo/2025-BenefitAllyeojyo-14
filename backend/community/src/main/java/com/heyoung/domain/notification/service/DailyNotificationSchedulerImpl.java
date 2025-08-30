package com.heyoung.domain.notification.service;

import com.heyoung.domain.benefit.entity.Category;
import com.heyoung.domain.benefit.entity.Partnership;
import com.heyoung.domain.benefit.repository.PartnershipNearbyRepository;
import com.heyoung.domain.benefit.service.PartnershipService;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.repository.NotificationAggRepository;
import com.heyoung.domain.notification.repository.NotificationLogRepository;
import com.heyoung.domain.notification.repository.NotificationRepository;
import com.heyoung.domain.recommendation.repository.UserHourHistRepository;
import com.heyoung.domain.recommendation.repository.UserPreferenceReadRepository;
import com.heyoung.domain.university.entity.University;
import com.heyoung.domain.university.service.UserUniversityQueryService;
import com.heyoung.global.enums.HourBucket;
import com.heyoung.global.enums.NotificationChannel;
import com.heyoung.global.enums.NotificationType;
import jakarta.transaction.Transactional;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service @Slf4j
@RequiredArgsConstructor
public class DailyNotificationSchedulerImpl implements DailyNotificationScheduler {
    private final UserUniversityQueryService userUniversityQueryService;
    private final NotificationLogRepository notificationLogRepository;
    private final NotificationRepository notificationRepository;
    private final PartnershipService partnershipService;
    private final PartnershipNearbyRepository nearbyRepository;
    private final NotificationAggRepository aggRepository;
    private final UserPreferenceReadRepository preferenceReadRepository;

    // 가중치
    private static final double W_PREF = 0.45;
    private static final double W_PROX = 0.25; // 거리기반.
    private static final double W_POP = 0.15;
    private static final double W_SAT = 0.20;

    // 포화 기준 : 하루 3회면 포화 1.0
    private static final double SATURATION_DENOM = 3.0;

    // 선호 없을 때 기본 시간대 (정오, 18시, 21시)
    private static final List<HourBucket> DEFAULT_HOURS =
            List.of(HourBucket.HOUR_12, HourBucket.HOUR_18, HourBucket.HOUR_21);

    // 최근 N 일 내 보낸 제휴는 제외.
    private static final int EXCLUDE_DAYS = 7;

    // 하루 예약 개수
    private static final int RESERVATIONS_PER_DAY = 3;

    private static final String BASE_URL = "http://localhost:8081";
    private final UserHourHistRepository userHourHistRepository;

    @Transactional
    public void scheduleTodayTop3(Long userId, ZoneId userZone) {
        LocalDate today = LocalDate.now(userZone);
        Instant now = Instant.now();
        Instant cutoff = now.minus(EXCLUDE_DAYS, ChronoUnit.DAYS);

        University university = userUniversityQueryService.getUniversityByUserId(userId);

        // 선호 Top 3
        List<HourBucket> hours = top3HourBuckets(userId);

        // 오늘(또는 내일) 전송 시각 3개 계산(각 시간대 30분 전)
        List<Instant> sendTimes = computeThreeSendTimes(userZone, hours, now);

        // 카테고리 선호도, 대학교와의 거리 선호도, 노출 빈도수를 기반으로 예약 생성
        Set<Long> reservedPartnershipIds = new HashSet<>();

        List<RecItem> recommend = recommend(userId, userZone, university.getLocation().getX(), university.getLocation().getY(), 50000000, List.of(), 3, reservedPartnershipIds);

        // 최근 7일 동안 보낸 제휴 id 모음
        Set<Long> sentPartnershipIds = notificationLogRepository.findSentPartnershipIdsSince(userId, cutoff);

        // 이미 보낸 것(sentPartnershipIds) + 이번 배치에서 중복 예약 방지
        List<Long> chosen = new ArrayList<>(RESERVATIONS_PER_DAY);
        Set<Long> reservedIds = new HashSet<>();

        for(RecItem r : recommend) {

            if(sentPartnershipIds.contains(r.getPartnershipId())) continue; // 최근 7일 내 보낸 제휴 제외
            if(reservedIds.contains(r.getPartnershipId())) continue; // 같은 배치 중복 제외

            // 같은 날 같은 제휴 이미 예약돼 있으면 패스
            Instant dayStart = today.atStartOfDay(userZone).toInstant();
            Instant dayEnd = dayStart.plus(1, ChronoUnit.DAYS);

            Partnership partnership = partnershipService.findById(r.getPartnershipId());

            if(notificationRepository.existsByUserIdAndPartnershipAndScheduledAtBetween(userId, partnership, dayStart, dayEnd)) continue;

            chosen.add(r.getPartnershipId());
            reservedIds.add(r.getPartnershipId());
            if(chosen.size() == RESERVATIONS_PER_DAY) break;

        }

        // 선택된 최대 3개에 대해 알림 예약 생성
        for(int i = 0; i<chosen.size(); i++) {
            Long id = chosen.get(i);
            Instant scheduleAt = sendTimes.get(i);

            Partnership partnership = partnershipService.findById(id);

            // 알림 예약
            Notification n = Notification.createReservation(
                    userId,
                    partnership,
                    "[제휴 혜택] " + partnership.getCompanyName(),
                    partnership.getNotes() + " " + partnership.getDiscountRate(),
                    NotificationType.PAYMENT_BASED,
                    NotificationChannel.INAPP,
                    BASE_URL+"/benefit/"+partnership.getId(),
                    partnership.getPartnershipImages().get(0).getImageUrl(),
                    scheduleAt);

            notificationRepository.save(n);

        }


    }

    @Getter
    @Builder
    public static class RecItem {
        private final Long partnershipId;
        private final Long categoryId;
        private final double distanceMeters;

        private final double pref;   // [0,1]
        private final double prox;   // [0,1], 가까울수록 1
        private final double pop;    // [0,1]
        private final double sat;    // [0,1] (과다 노출 정도)

        private final double score;  // 최종 점수
    }


    private List<RecItem> recommend(Long userId, ZoneId userZone, double lat, double lon, int radiusMeters, List<Category> categories, int limit, Set<Long> reservedPartnershipIds) {

        LocalDate today = LocalDate.now(userZone);
        boolean catsEmpty = (categories == null || categories.isEmpty());

        // 반경 내 후보 - 캐시
        List<PartnershipNearbyRepository.PartnershipNearbyRow> rows =
                findNearbyCached(lat, lon, radiusMeters, today, catsEmpty, categories, Math.min(limit, 200));

        if (rows.isEmpty()) return List.of();

        // 보조 피처 수집
        Instant now = Instant.now();

        // 사용자 카테고리 선호
        Set<Long> catSet = rows.stream().map(PartnershipNearbyRepository.PartnershipNearbyRow::getCategoryId).collect(Collectors.toSet());
        List<UserPreferenceReadRepository.CatPrefRow> catCounts = preferenceReadRepository.findCategoryCounts(userId, catSet.isEmpty(), new ArrayList<>(catSet));
        Map<Long, Long> catCountMap = catCounts.stream().collect(Collectors.toMap(UserPreferenceReadRepository.CatPrefRow::getCategoryId, UserPreferenceReadRepository.CatPrefRow::getUseCount));
        long maxCat = catCountMap.values().stream().mapToLong(l -> l).max().orElse(0L);

        // 인기(최근 7일) - 노출 로그 기반(결제/조회 테이블 있으면 교체)
        Instant popCutoff = now.minus(Duration.ofDays(7));
        List<NotificationAggRepository.PartnershipCountRow> popRows = aggRepository.countPartnershipExposedLast7d(popCutoff);
        Map<Long, Long> popMap = popRows.stream().collect(Collectors.toMap(NotificationAggRepository.PartnershipCountRow::getPartnershipId, NotificationAggRepository.PartnershipCountRow::getCnt));
        long maxPop = popMap.values().stream().mapToLong(l -> l).max().orElse(0L);

        // 과다 노출
        Instant satCutoff = now.minus(Duration.ofHours(24));
        List<NotificationAggRepository.CategoryCountRow> satRows = aggRepository.countUserCategoryExposedLast24h(userId, satCutoff);
        Map<Long, Long> satMap = satRows.stream().collect(Collectors.toMap(NotificationAggRepository.CategoryCountRow::getCategoryId, NotificationAggRepository.CategoryCountRow::getCnt));

        // 점수 계산
        List<RecItem> items = new ArrayList<>(rows.size());
        for (PartnershipNearbyRepository.PartnershipNearbyRow r : rows) {
            double pref = (maxCat > 0) ? clamp01((double) catCountMap.getOrDefault(r.getCategoryId(), 0L) / maxCat) : 0.0;
            double prox = clamp01(1.0 - (r.getDistanceMeters() / radiusMeters)); // 가까울수록 1
            double pop = (maxPop > 0) ? clamp01((double) popMap.getOrDefault(r.getPartnershipId(), 0L) / maxPop) : 0.0;

            double satRow = (double) satMap.getOrDefault(r.getCategoryId(), 0L);
            double sat = clamp01(satRow / SATURATION_DENOM); // 3회면 1.0 패널티

            double score = W_PREF * pref + W_PROX * prox + W_POP * pop - W_SAT * sat;

            items.add(RecItem.builder()
                    .partnershipId(r.getPartnershipId())
                    .categoryId(r.getCategoryId())
                    .distanceMeters(r.getDistanceMeters())
                    .pref(pref).prox(prox).pop(pop).sat(sat)
                    .score(score)
                    .build());

            reservedPartnershipIds.add(r.getPartnershipId());

        }

        // 점수로 정렬 후 상위 N개 반환
        return items.stream()
                .sorted(Comparator.comparingDouble(RecItem::getScore).reversed()
                        .thenComparingDouble(RecItem::getDistanceMeters))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private static double clamp01(double v) {
        if (v < 0) return 0;
        if (v > 1) return 1;
        return v;
    }

    private List<PartnershipNearbyRepository.PartnershipNearbyRow> findNearbyCached(double lat, double lon, int radiusMeters, LocalDate today, boolean catsEmpty, List<Category> categories, int limit) {
        return nearbyRepository.findNearbyCandidates(lat, lon, radiusMeters, today, catsEmpty, categories == null? List.of() : categories, limit);
    }

    private List<HourBucket> top3HourBuckets(Long userId) {
        List<HourBucket> hourBuckets = userHourHistRepository.findTop5ByUserIdOrderByUseCountDesc(userId).stream()
                .map(userHourHist -> userHourHist.getHourBucket()).toList();
        List<HourBucket> defaults = userHourHistRepository.findAllByHourBucketIn(DEFAULT_HOURS).stream()
                .map(hourBucket -> hourBucket.getHourBucket()).toList();
        return hourBuckets.isEmpty() ? DEFAULT_HOURS : hourBuckets;
    }

    /**
     * 각 시간대의 해당일 버킷 시작시각 - 30분 이 현재보다 과거면 다음날로 밈.
     */
    private List<Instant> computeThreeSendTimes(ZoneId zone, List<HourBucket> hours, Instant now) {
        LocalDate today = LocalDate.now(zone);
        List<Instant> result = new ArrayList<>(RESERVATIONS_PER_DAY);
        for(int i = 0; i<RESERVATIONS_PER_DAY; i++) {
            HourBucket hb = hours.get(i % hours.size());
            LocalTime bucketStart = HourBucket.startTimeOr(LocalTime.of(12, 0), hb);
            Instant candidate = ZonedDateTime.of(today, bucketStart, zone).minusMinutes(30).toInstant();
            if (candidate.isBefore(now)) {
                candidate = ZonedDateTime.of(today.plusDays(1), bucketStart, zone).minusMinutes(30).toInstant();
            }
            result.add(candidate);
        }
        return result;
    }
}
