package com.heyoung.domain.notification.controller;

import com.heyoung.domain.notification.dto.response.GetNotificationByRemindResponseDto;
import com.heyoung.domain.notification.dto.response.GetNotificationListByUserResponseDto;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.service.DailyNotificationScheduler;
import com.heyoung.domain.notification.service.NotificationLogCommandService;
import com.heyoung.domain.notification.service.NotificationQueryService;
import com.heyoung.domain.notification.service.NotificationSendService;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import com.heyoung.global.webconfig.MemberId;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
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
    private final NotificationLogCommandService notificationLogCommandService;

    @GetMapping
    @Operation(
            summary="사용자가 받은 알림 리스트 조회",
            description="유저 알림(최근순) 무한 스크롤"
    )
    public BaseResponse<Page<GetNotificationListByUserResponseDto>> getNotificationList(@MemberId Long userId, @RequestParam int page, @RequestParam int size) { // 무한 스크롤

        return BaseResponse.onSuccess(notificationQueryService.findUserNotificationList(userId, page, size), ResponseCode.OK);

    }

    @GetMapping("/remind")
    @Operation(
            summary="사용자가 받은 알림 중 안 읽은 것 리마인드",
            description="사용자가 받은 알림 중 가장 최근 것인데, 안 읽은 것을 골라서 현재 위치 기반 가장 가까운 곳을 반환"
    )
    public BaseResponse<GetNotificationByRemindResponseDto> remindNotification(@MemberId Long userId, @RequestParam Double lat, @RequestParam Double lng) {

        return BaseResponse.onSuccess(notificationQueryService.findRemindNotification(1001L, lat, lng), ResponseCode.OK);

    }

    @PatchMapping("/read")
    @Operation(
            summary = "사용자가 받은 알림 클릭하면 읽은 것으로 처리하는 API",
            description = "사용자가 받은 알림 읽으면 알림 읽음으로 상태 변경"
    )
    public BaseResponse<String> readNotification(@MemberId Long userId, @RequestParam Long notificationId) {
        return BaseResponse.onSuccess(notificationLogCommandService.readNotification(notificationId), ResponseCode.OK);
    }

    @Hidden
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

    @Hidden
    @PostMapping("/push")
    @Operation(
            summary="즉시 푸시 전송 테스트",
            description="해당 유저의 '발송 시각이 지났지만 아직 미발송' 예약을 최대 N건 찾아 즉시 전송"
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
}
