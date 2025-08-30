package com.heyoung.domain.notification.service;

import com.heyoung.domain.benefit.entity.Partnership;
import com.heyoung.domain.benefit.service.PartnershipBranchService;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.repository.NotificationRepository;
import com.heyoung.domain.university.entity.FreeSlot;
import com.heyoung.domain.university.service.FreeSlotQueryService;
import com.heyoung.domain.university.service.UserUniversityQueryService;
import com.heyoung.global.enums.NotificationChannel;
import com.heyoung.global.enums.NotificationType;
import com.heyoung.global.enums.Weekday;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimetableGapNotificationScheduler {

    private final FreeSlotQueryService freeSlotQueryService;
    private final PartnershipBranchService partnershipBranchService;
    private final NotificationRepository notificationRepository;
    private final UserUniversityQueryService userUniversityQueryService;

    /** 한 날짜에 최대 몇 건 예약? */
    private static final int RESERVATIONS_PER_DAY = 1;
    /** 최소 공강 길이(분) */
    private static final int MIN_GAP_MINUTES = 50;
    /** 조용한 시간대 시작/끝(로컬) — 이 시간대 안에는 예약하지 않음 */
    private static final LocalTime QUIET_FROM = LocalTime.of(0, 0);
    private static final LocalTime QUIET_TO   = LocalTime.of(8, 0);
    /** 같은 제휴 7일 이내 재발송 금지 */
    private static final int EXCLUDE_DAYS = 7;

    private static final String FALLBACK_IMAGE = "https://example.com/static/default.png";
    private static final String BASE_URL = "http://localhost:8081";

    @Transactional
    public void scheduleForToday(Long userId, ZoneId userZone) {
        LocalDate localDate = LocalDate.now(userZone);
        Weekday today = Weekday.from(localDate.getDayOfWeek()).orElse(Weekday.THURSDAY);
        Instant now = Instant.now();

        // 1) 오늘 공강 조회(최소 40분)
        List<FreeSlot> gaps = freeSlotQueryService.findTodayFreeSlot(userId, today);
        log.info("gaps : {}", gaps.size());

//        gaps = filterQuietHours(gaps); // 조용한 시간대 제거
        if (gaps.isEmpty()) {
            log.info("[TimetableGapScheduler] user={} today={} 공강 없음 - skip", userId, today);
            return;
        }

        // 3) 공강별 예약 시간 계산: gap 시작 + 5분 (너무 뻣뻣하면 조정)
        List<Instant> sendTimes = getInstantList(gaps, localDate);

        log.info("sendTimes : {}", Arrays.deepToString(sendTimes.toArray()));
        int made = 0;
        for (Instant sendAt : sendTimes) {

            Notification n = Notification.createReservation(
                    userId, null,
                    "[공강 혜택 요정] 공강에 나만의 제휴를 확인해보세요!",
                    "공강에 나만을 위한 혜택을 확인해보세요!",
                    NotificationType.TIMETABLE_BASED,
                    NotificationChannel.EXPO,
                    BASE_URL + "/benefit/",
                    FALLBACK_IMAGE,
                    sendAt
            );
            notificationRepository.save(n);
            made++;
            if (made >= RESERVATIONS_PER_DAY) break;
        }

        log.info("[TimetableGapScheduler] user={} today={} 예약 {}건 생성", userId, today, made);
    }

    private List<Instant> getInstantList(List<FreeSlot> gaps, LocalDate today) {
        ZoneId zone = ZoneId.of("Asia/Seoul"); // 사용자 타임존

        List<Instant> result = new ArrayList<>();
        for (FreeSlot slot : gaps) {
            // LocalTime
            LocalTime start = slot.getStartTime();
            LocalTime end = slot.getEndTime();

            // LocalDate + LocalTime + ZoneId -> ZonedDateTime -> Instant
            Instant startInstant = ZonedDateTime.of(today, start, zone).plusMinutes(5).toInstant();
            Instant endInstant   = ZonedDateTime.of(today, end, zone).toInstant();

            result.add(startInstant);
        }

        return result;
    }

//    private List<FreeSlot> filterQuietHours(List<FreeSlot> gaps) {
//        // [00:00~08:00] 구간은 제외
//        return gaps.stream()
//                .filter(g -> !(g.getStartTime().isBefore(QUIET_TO) && g.getEndTime().isAfter(QUIET_FROM)))
//                .toList();
//    }

//    /** 공강 시작 + 5분을 기본 예약 시각으로, 과거면 '오늘 같은 시각은 건너뛰고' 다음 gap 사용 */
//    private List<Instant> computeSendTimes(LocalDate localDate, ZoneId zone, List<FreeSlot> gaps, Instant now, int want) {
//        List<Instant> result = new ArrayList<>(want);
//        for (FreeSlot g : gaps) {
//            if (result.size() >= want) break;
//            var candidate = ZonedDateTime.of(localDate, g.getStartTime().plusMinutes(5), zone).toInstant();
//            if (candidate.isAfter(now)) {
//                result.add(candidate);
//            }
//        }
//        // 부족하면 다음날 동일 시간에도 넣고 싶다면 여기서 보충 로직 추가 가능
//        return result;
//    }
}
