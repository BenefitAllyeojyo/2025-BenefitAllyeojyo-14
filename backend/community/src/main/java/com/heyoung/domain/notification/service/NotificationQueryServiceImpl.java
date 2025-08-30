package com.heyoung.domain.notification.service;

import com.heyoung.domain.notification.dto.response.GetNotificationListByUserResponseDto;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.exception.NotificationException;
import com.heyoung.domain.notification.repository.NotificationRepository;
import com.heyoung.global.enums.SendStatus;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationQueryServiceImpl implements NotificationQueryService {
    private final NotificationRepository notificationRepository;

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

    private void validatePageAndSize(int page, int size) {
        if(page < 0 || size < 0) {
            throw new NotificationException(ResponseCode.PAGE_AND_SIZE_NOT_CORRECT);
        }
    }
}
