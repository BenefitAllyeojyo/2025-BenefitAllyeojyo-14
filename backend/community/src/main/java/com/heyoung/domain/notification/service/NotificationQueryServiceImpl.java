package com.heyoung.domain.notification.service;

import com.heyoung.domain.benefit.dto.response.PartnershipByLocationResponseDto;
import com.heyoung.domain.benefit.repository.PartnershipBranchRepository;
import com.heyoung.domain.benefit.service.PartnershipBranchService;
import com.heyoung.domain.benefit.service.PartnershipService;
import com.heyoung.domain.notification.dto.response.GetNotificationByRemindResponseDto;
import com.heyoung.domain.notification.dto.response.GetNotificationListByUserResponseDto;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.entity.NotificationLog;
import com.heyoung.domain.notification.exception.NotificationException;
import com.heyoung.domain.notification.repository.NotificationLogRepository;
import com.heyoung.domain.notification.repository.NotificationRepository;
import com.heyoung.domain.notification.service.converter.NotificationLogConverter;
import com.heyoung.global.enums.SendStatus;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service @Slf4j
@RequiredArgsConstructor
public class NotificationQueryServiceImpl implements NotificationQueryService {
    private final NotificationRepository notificationRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final PartnershipBranchService partnershipBranchService;

    public List<Notification> findUserRecent(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * 사용자가 받은 알림 내역 반환
     */
    public Page<GetNotificationListByUserResponseDto> findUserNotificationList(Long userId, int page, int size) {

        validatePageAndSize(page, size);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "ScheduledAt"));

        Page<Notification> notificationList = notificationRepository.findByUserIdAndSendStatus(userId, SendStatus.SENT, pageRequest);

        return notificationList.map(notification -> new GetNotificationListByUserResponseDto(notification.getPartnership().getId(), notification.getTitle(), notification.getContent()));

    }

    public GetNotificationByRemindResponseDto findRemindNotification(Long userId, Double lat, Double lng) {

        // 가장 최근에 보냈고 안 읽은 알림들 가져오기.
        NotificationLog notificationLog = notificationLogRepository.findTopByUserIdAndSendStatusAndIsReadOrderByOccurredAtDesc(userId, SendStatus.SENT, false);

        // 가장 최근에 보냈고, 사용자가 읽지 않은 제휴에서 현재 가장 가까운 지점 불러오기
        PartnershipBranchRepository.NearbyBranchRow partnershipByLocationAndIsNotRead = partnershipBranchService.getPartnershipByLocationAndIsNotRead(userId, lat, lng, notificationLog.getNotification().getPartnership().getId());

        /**
         * 알림 보냈지만 안 읽은 제휴 중에 가장 가까운 지점 정보 제공.
         */

        return NotificationLogConverter.toNotificationByRemindResponse(partnershipByLocationAndIsNotRead, notificationLog);

    }

    private void validatePageAndSize(int page, int size) {
        if(page < 0 || size < 0) {
            throw new NotificationException(ResponseCode.PAGE_AND_SIZE_NOT_CORRECT);
        }
    }
}
