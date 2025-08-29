package com.heyoung.domain.notification.service;

import com.heyoung.domain.benefit.entity.Category;
import com.heyoung.domain.benefit.entity.Partnership;
import com.heyoung.domain.benefit.service.PartnershipService;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.repository.NotificationLogRepository;
import com.heyoung.domain.notification.repository.NotificationRepository;
import com.heyoung.domain.recommendation.repository.UserCategoryRepository;
import com.heyoung.domain.recommendation.repository.UserHourHistRepository;
import com.heyoung.domain.university.entity.University;
import com.heyoung.domain.university.service.UserUniversityQueryService;
import com.heyoung.global.enums.HourBucket;
import com.heyoung.global.enums.NotificationChannel;
import com.heyoung.global.enums.NotificationType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DailyNotificationSchedulerImpl implements DailyNotificationScheduler {
    private final UserUniversityQueryService userUniversityQueryService;
    private final NotificationLogRepository notificationLogRepository;
    private final NotificationRepository notificationRepository;
    private final PartnershipService partnershipService;

    // 선호 없을 때 기본 시간대 (정오, 18시, 21시)
    private static final List<HourBucket> DEFAULT_HOURS =
            List.of(HourBucket.HOUR_12, HourBucket.HOUR_18, HourBucket.HOUR_21);

    // 최근 N 일 내 보낸 제휴는 제외.
    private static final int EXCLUDE_DAYS = 7;

    // 하루 예약 개수
    private static final int RESERVATIONS_PER_DAY = 3;

    private static final String BASE_URL = "http://localhost:8081";
    private final UserCategoryRepository userCategoryRepository;
    private final UserHourHistRepository userHourHistRepository;

    @Transactional
    public void scheduleTodayTop3(Long userId, ZoneId userZone) {
        LocalDate today = LocalDate.now(userZone);
        Instant now = Instant.now();
        Instant cutoff = now.minus(EXCLUDE_DAYS, ChronoUnit.DAYS);

        // 선호 Top 3
        List<Category> cats = top3Categories(userId);
        List<HourBucket> hours = top3HourBuckets(userId);

        // 오늘(또는 내일) 전송 시각 3개 계산(각 시간대 30분 전)
        List<Instant> sendTimes = computeThreeSendTimes(userZone, hours, now);

        // 최근 7일 동안 보낸 제휴 id 모음
        Set<Long> sentPartnershipIds = notificationLogRepository.findSentPartnershipIdsSince(userId, cutoff);

        // 카테고리/시간대 라운드로빈 매칭하여 제휴 조회 + 예약 생성
        Set<Long> reservedPartnershipIds = new HashSet<>();

        List<Partnership> candidates = pickPartnership(userId, cats, today, cutoff, reservedPartnershipIds);

        // 이미 보낸 것(sentPartnershipIds) + 이번 배치에서 중복 예약 방지
        List<Partnership> chosen = new ArrayList<>(RESERVATIONS_PER_DAY);
        Set<Long> reservedIds = new HashSet<>();

        for(Partnership p : candidates) {

            if(sentPartnershipIds.contains(p.getId())) continue; // 최근 7일 내 보낸 제휴 제외
            if(reservedIds.contains(p.getId())) continue; // 같은 배치 중복 제외

            // 같은 날 같은 제휴 이미 예약돼 있으면 스킵
            Instant dayStart = today.atStartOfDay(userZone).toInstant();
            Instant dayEnd = dayStart.plus(1, ChronoUnit.DAYS);

            if(notificationRepository.existsByUserIdAndPartnershipAndScheduledAtBetween(userId, p, dayStart, dayEnd)) continue;

            chosen.add(p);
            reservedIds.add(p.getId());
            if(chosen.size() == RESERVATIONS_PER_DAY) break;


        }

        // 선택된 최대 3개에 대해 알림 예약 생성
        for(int i = 0; i<chosen.size(); i++) {
            Partnership partnership = chosen.get(i);
            Instant scheduleAt = sendTimes.get(i);

            // 예약 저장(해커톤 스코프로 간단 텍스트)
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

    private List<Category> top3Categories(Long userId) {
        List<Category> categories = userCategoryRepository.findTop5ByUserIdOrderByUseCountDesc(userId).stream()
                .map(userCategory -> userCategory.getCategory()).toList();

        University university = userUniversityQueryService.getUniversityByUserId(userId);
        List<Category> defaults = partnershipService.findTop5Categories(university);

        return categories.isEmpty() ? defaults : categories;
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

    // 카테고리 선호로 검색
    private List<Partnership> pickPartnership(Long userId,
                                           List<Category> categories,
                                           LocalDate today,
                                           Instant cutoff,
                                           Set<Long> excludeIds) {
        List<Partnership> candidates = partnershipService.findActiveByCategoriesExcludeSent(
                categories, today, userId, cutoff);

        List<Partnership> result = new ArrayList<>();
        for(Partnership p : candidates) {
            if(!excludeIds.contains(p.getId())) result.add(p);
        }

        return result;
    }
}
