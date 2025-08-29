package com.heyoung.domain.notification.controller;

import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.service.DailyNotificationScheduler;
import com.heyoung.domain.notification.service.NotificationQueryService;
import com.heyoung.domain.notification.service.NotificationSendService;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@RestController
//@Profile({"local", "dev"})
@RequiredArgsConstructor
@Tag(name="알림 테스트 API", description = "알림 기능을 테스트할 수 있는 API입니다.")
@RequestMapping("/notifications")
public class NotificationController {

    private final JobLauncher jobLauncher;
    private final Job notificationsReservationJob;

    private final NotificationSendService notificationSendService;
    private final NotificationQueryService notificationQueryService;
    private final DailyNotificationScheduler dailyNotificationScheduler;

    @GetMapping("/test")
    @Operation(
            summary="알림 예약 로직 테스트",
            description="(1) 유저 선호 기반으로 오늘/내일 전송 예약 3건 생성 → (2) 생성된 예약 일부를 확인용으로 반환"
    )
    public BaseResponse<List<Notification>> testNotification(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "Asia/Seoul") String tz
    ) {
        List<Notification> upcoming = null;
        try {
            ZoneId zone = ZoneId.of(tz);
            dailyNotificationScheduler.scheduleTodayTop3(userId, zone);

            // 방금 예약된 것들 확인(지금 시각 이후 36시간 안에 잡힌 예약 상위 10건)
            Instant now = Instant.now();
            Instant until = now.plusSeconds(36 * 3600);
            upcoming = notificationQueryService.findUserScheduledBetween(userId, now, until);

        } catch (Exception e) {
            log.error("testNotification failed", e);
        }

        return BaseResponse.onSuccess(upcoming, ResponseCode.OK);
    }

    @PostMapping("/run")
    @Operation(summary="배치가 잘 동작하는 테스트 하는 controller", description = "배치가 잘 동작하는지 확인.")
    public BaseResponse<String> run() {
        try {
            jobLauncher.run(
                    notificationsReservationJob,
                    new JobParametersBuilder()
                            .addLong("run.id", System.currentTimeMillis())
                            .toJobParameters()
            );
            return BaseResponse.onSuccess("notificationsReservationJob launched", ResponseCode.OK);
        } catch (Exception e) {
            log.error("launch failed", e);
            return BaseResponse.onFailure("launch failed : " + e.getMessage(), ResponseCode._INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/push")
    @Operation(
            summary="즉시 푸시 전송 테스트",
            description="해당 유저의 '발송 시각이 지났지만 아직 미발송' 예약을 최대 N건 찾아 FCM으로 즉시 전송"
    )
    public BaseResponse<String> pushNotifications(@RequestParam Long userId) {

        try {
            int sent = notificationSendService.sendDueForUser(userId);
            return BaseResponse.onSuccess("sent=" + sent, ResponseCode.OK);
        } catch (Exception e) {
            log.error("pushNotifications failed", e);
            return BaseResponse.onFailure("pushNotifications failed: " + e.getMessage(), ResponseCode._INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    @Operation(
            summary="사용자 예약/발송 목록 조회",
            description="유저 알림(최근순) 상위 N건을 확인"
    )
    public BaseResponse<List<Notification>> getNotification(@RequestParam Long userId) { // 무한 스크롤
        List<Notification> list = null;
        try {
            Instant now = Instant.now();
            Instant sevenDaysAgo = now.minus(7, ChronoUnit.DAYS);
            list = notificationQueryService.findUserScheduledBetween(userId, sevenDaysAgo, now);
        } catch (Exception e) {
            log.error("getNotification failed : {}", e.getMessage());
        }

        return BaseResponse.onSuccess(list, ResponseCode.OK);
    }
}
