package com.heyoung.domain.notification.service;

import com.heyoung.domain.notification.dto.response.GetNotificationListByUserResponseDto;
import com.heyoung.domain.notification.entity.Notification;
import org.springframework.data.domain.Page;

import java.time.Instant;
import java.util.List;

public interface NotificationQueryService {
    List<Notification> findUserRecent(Long userId);
    Page<GetNotificationListByUserResponseDto> findUserNotificationList(Long userId, int page, int size);
}
