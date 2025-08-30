package com.heyoung.domain.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.entity.NotificationLog;
import com.heyoung.domain.notification.entity.PushToken;
import com.heyoung.domain.notification.repository.NotificationLogRepository;
import com.heyoung.domain.notification.repository.NotificationRepository;
import com.heyoung.domain.notification.repository.PushTokenRepository;
import com.heyoung.global.enums.NotificationChannel;
import com.heyoung.global.enums.SendStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationSendServiceImpl implements NotificationSendService {

    private final NotificationRepository notificationRepository;
    private final PushTokenRepository pushTokenRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final FirebaseMessaging firebaseMessaging; // FirebaseApp 초기화는 기존 구성 사용

    @Override
    @Transactional
    public int sendDueForUser(Long userId) {
        Instant now = Instant.now();

        List<Notification> due = notificationRepository.findDueForUser(userId, now);

        int success = 0;
        for (Notification n : due) {
            try {
                // 유저 활성 토큰 가져오기(최소 1개)
                List<PushToken> tokens = pushTokenRepository.findByUserIdAndChannelAndActiveTrue(userId, NotificationChannel.PUSH);
                if (tokens.isEmpty()) {
                    log.warn("no active token for userId={}", userId);
                    markFailed(n, "NO_TOKEN");
                    continue;
                }

                // 여기서는 첫 토큰만 사용(테스트 목적). 멀티 토큰 전송은 loop/Topic 로 확장
                String token = tokens.get(0).getToken();

                Message msg = Message.builder()
                        .setToken(token)
                        .setNotification(com.google.firebase.messaging.Notification.builder()
                                .setTitle(n.getTitle())
                                .setBody(n.getContent())
                                .build())
                        .putData("clickUrl", n.getClickUrl())
                        .putData("imagePath", n.getImagePath())
                        .build();

                String messageId = firebaseMessaging.send(msg);
                log.info("FCM sent: messageId={}, notifId={}", messageId, n.getId());

                // 로그 적재 & 상태 갱신
                NotificationLog logEntity = NotificationLog.sentOf(n, userId, "FCM:" + messageId);
                notificationLogRepository.save(logEntity);

                n.setSendStatus(SendStatus.SENT);
                notificationRepository.save(n);

                success++;
            } catch (Exception ex) {
                log.error("send failed, notifId={}", n.getId(), ex);
                markFailed(n, ex.getClass().getSimpleName());
            }
        }
        return success;
    }

    private void markFailed(Notification n, String reason) {
        n.setSendStatus(SendStatus.FAILED);
        notificationRepository.save(n);
        notificationLogRepository.save(NotificationLog.failedOf(n, n.getUserId(), reason));
    }

}
