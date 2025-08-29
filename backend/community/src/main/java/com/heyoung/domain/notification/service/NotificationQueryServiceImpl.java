package com.heyoung.domain.notification.service;

import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
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

    public List<Notification> findUserScheduledBetween(Long userId, Instant from, Instant to) {
        return notificationRepository.findScheduledBetween(userId, from, to);
    }
}
