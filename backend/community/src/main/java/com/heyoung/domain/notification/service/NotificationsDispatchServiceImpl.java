package com.heyoung.domain.notification.service;

import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.entity.NotificationLog;
import com.heyoung.domain.notification.entity.PushToken;
import com.heyoung.domain.notification.repository.NotificationLogRepository;
import com.heyoung.domain.notification.repository.NotificationRepository;
import com.heyoung.domain.notification.repository.PushTokenRepository;
import com.heyoung.global.enums.NotificationChannel;
import com.heyoung.global.enums.SendStatus;
import com.heyoung.global.infra.expo.ExpoPushSender;
import com.heyoung.global.infra.fcm.FcmSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationsDispatchServiceImpl implements NotificationsDispatchService {

    private final NotificationRepository notificationRepository;
    private final PushTokenRepository pushTokenRepository;
    private final NotificationLogRepository notificationLogRepository;

    // 선택: 둘 다 쓸 수 있게 의존성 주입 (없으면 없는대로 빈 등록 제외)
    private final Optional<FcmSender> fcmSender;
    private final Optional<ExpoPushSender> expoSender;

    @Scheduled(fixedDelayString = "${notify.dispatch.fixed-delay-ms:30000}", initialDelay = 15000)
    @Transactional
    public void dispatchDueNotifications() {
        log.info("알림 처리 스케줄러 실행");
        Instant now = Instant.now();

        List<Notification> due = notificationRepository
                .findTop100BySendStatusAndScheduledAtBeforeOrderByScheduledAtAsc(SendStatus.SCHEDULED, now);

        for (Notification n : due) {
            try {
                processOne(n);
            } catch (Exception ex) {
                log.error("processOne failed id={}", n.getId(), ex);
                // 재시도 전략: 상태 유지(SCHEDULED) or FAILED 로 마킹 등 정책에 맞게
            }
        }
    }

    private void processOne(Notification n) throws Exception {
        String uniq = "SEND:" + n.getId();

        // 이미 전송 로그가 있다면(멱등) 상태만 SENT 로 만들고 스킵할 수도 있음
        if (notificationLogRepository.existsByUniqKey(uniq)) {
            n.setSendStatus(SendStatus.SENT);
            return;
        }

        // 채널 별 토큰
        List<PushToken> expoTokens = expoSender.isPresent()
                ? pushTokenRepository.findByUserIdAndChannelAndActiveTrue(n.getUserId(), NotificationChannel.EXPO)
                : List.of();

        List<PushToken> fcmTokens = fcmSender.isPresent()
                ? pushTokenRepository.findByUserIdAndChannelAndActiveTrue(n.getUserId(), NotificationChannel.PUSH)
                : List.of();

        boolean anySuccess = false;

        // 1) EXPO
        if (!expoTokens.isEmpty() && expoSender.isPresent()) {
            anySuccess |= sendAndTouchTokensViaExpo(n, expoTokens);
        }

        // 2) FCM
        if (!fcmTokens.isEmpty() && fcmSender.isPresent()) {
            anySuccess |= sendAndTouchTokensViaFcm(n, fcmTokens);
        }

        // 결과 기록
        if (anySuccess) {
            n.setSendStatus(SendStatus.SENT);
            notificationLogRepository.save(NotificationLog.sentOf(n, n.getUserId(), uniq));
        } else {
            n.setSendStatus(SendStatus.FAILED);
            notificationLogRepository.save(NotificationLog.failedOf(n, n.getUserId(), uniq));
        }
    }

    private boolean sendAndTouchTokensViaExpo(Notification n, List<PushToken> tokenEntities) throws Exception {
        Map<String, Long> tokenToId = tokenEntities.stream()
                .collect(Collectors.toMap(PushToken::getToken, PushToken::getId, (a, b) -> a, LinkedHashMap::new));

        Map<String, Boolean> result = expoSender.get()
                .sendMulticast(n, tokenEntities.stream().map(PushToken::getToken).toList());

        return touchTokens(tokenToId, result);
    }

    private boolean sendAndTouchTokensViaFcm(Notification n, List<PushToken> tokenEntities) throws Exception {
        Map<String, Long> tokenToId = tokenEntities.stream()
                .collect(Collectors.toMap(PushToken::getToken, PushToken::getId, (a, b) -> a, LinkedHashMap::new));

        Map<String, Boolean> result = fcmSender.get()
                .sendMulticast(n, tokenEntities.stream().map(PushToken::getToken).toList());

        return touchTokens(tokenToId, result);
    }

    private boolean touchTokens(Map<String, Long> tokenToId, Map<String, Boolean> result) {
        List<Long> successIds = new ArrayList<>();
        List<Long> failedIds = new ArrayList<>();

        for (Map.Entry<String, Boolean> e : result.entrySet()) {
            Long tid = tokenToId.get(e.getKey());
            if (tid == null) continue;
            if (Boolean.TRUE.equals(e.getValue())) successIds.add(tid);
            else failedIds.add(tid);
        }

        if (!successIds.isEmpty()) {
            pushTokenRepository.touchSuccess(successIds, LocalDateTime.now(ZoneId.systemDefault()));
        }
        for (Long tid : failedIds) {
            pushTokenRepository.increaseFailCount(tid);
        }

        return !successIds.isEmpty();
    }
}
