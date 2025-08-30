package com.heyoung.domain.notification.service;

import com.heyoung.domain.notification.entity.NotificationLog;
import com.heyoung.domain.notification.exception.NotificationException;
import com.heyoung.domain.notification.repository.NotificationLogRepository;
import com.heyoung.global.exception.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationLogCommandServiceImpl implements NotificationLogCommandService {

    private final NotificationLogRepository notificationLogRepository;

    @Override
    @Transactional
    public String readNotification(Long notificationId) {
        NotificationLog notificationLog = notificationLogRepository.findById(notificationId).orElseThrow(() -> new NotificationException(ResponseCode.NOTIFICATION_NOT_FOUND));
        notificationLog.readNotificationLog();
        notificationLogRepository.save(notificationLog);
        return "알림 읽음 처리했습니다.";
    }
}
