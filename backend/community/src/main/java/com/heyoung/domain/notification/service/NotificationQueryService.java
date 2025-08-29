package com.heyoung.domain.notification.service;

import com.heyoung.domain.notification.entity.Notification;

import java.time.Instant;
import java.util.List;

public interface NotificationQueryService {
    List<Notification> findUserRecent(Long userId);
    List<Notification> findUserScheduledBetween(Long userId, Instant from, Instant to);
}
