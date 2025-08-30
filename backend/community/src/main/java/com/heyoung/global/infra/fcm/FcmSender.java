package com.heyoung.global.infra.fcm;

import com.google.firebase.messaging.*;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.global.exception.BaseResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class FcmSender {
    private final FirebaseMessaging firebase;

    public FcmSender(FirebaseMessaging firebase) {
        this.firebase = firebase;
    }

    // 여러 토큰으로 멀티캐스트 전송
    public Map<String, Boolean> sendMulticast(Notification n, List<String> tokens) throws Exception {
        Map<String, String> data = new HashMap<>();
        data.put("clickUrl", safe(n.getClickUrl()));
        data.put("type", n.getType().name());
        if(n.getPartnership() != null) data.put("partnershipId", String.valueOf(n.getPartnership().getId()));

        com.google.firebase.messaging.Notification notif =
                com.google.firebase.messaging.Notification.builder()
                        .setTitle(safe(n.getTitle()))
                        .setBody(safe(n.getContent()))
                        .setImage(safe(n.getImagePath()))
                        .build();

        MulticastMessage msg = MulticastMessage.builder()
                .setNotification(notif)
                .putAllData(data)
                .addAllTokens(tokens)
                .build();

        BatchResponse response = null;
        try {
            response = firebase.sendEachForMulticast(msg, false);
            log.info("FCM batch sent: success={}, failure={}",
                    response.getSuccessCount(), response.getFailureCount());
        } catch (com.google.firebase.messaging.FirebaseMessagingException e) {
            // 전체 실패: 재시도/알림/모니터링 등
            log.error("FCM request failed. code={}, messagingCode={}, msg={}",
                    e.getErrorCode(), e.getMessagingErrorCode(), e.getMessage(), e);
        }

        // ★ 개별 토큰 처리
        var results = response.getResponses();
        for (int i = 0; i < results.size(); i++) {
            SendResponse r = results.get(i);
            String token = tokens.get(i); // MulticastMessage에 넣은 순서와 동일

            if (r.isSuccessful()) {
                String messageId = r.getMessageId();
                log.info("FCM OK token={}, messageId={}", token, messageId);

                continue;
            }

            Exception ex = r.getException();
            if (ex instanceof FirebaseMessagingException fme) {
                var mcode = fme.getMessagingErrorCode();  // INVALID_ARGUMENT, UNREGISTERED, ...
                var http  = fme.getErrorCode();           // HTTP 상태류
                log.warn("FCM FAIL token={} mcode={} http={} detail={}",
                        token, mcode, http, fme.getMessage());

                // 실패 유형별 후처리 예시
                if (mcode == MessagingErrorCode.UNREGISTERED
                        || mcode == MessagingErrorCode.INVALID_ARGUMENT
                        || mcode == MessagingErrorCode.SENDER_ID_MISMATCH) {
                    // 영구 실패: 토큰 비활성화
                    // pushTokenRepository.markInactiveByToken(token, InvalidType.UNREGISTERED);
                } else if (mcode == MessagingErrorCode.QUOTA_EXCEEDED
                        || mcode == MessagingErrorCode.UNAVAILABLE
                        || mcode == MessagingErrorCode.INTERNAL) {
                    // 일시 실패: 재시도 큐로
                    // retryQueue.offer(token);
                } else {
                    // 그 외: 실패 카운트 증가 등
                    // pushTokenRepository.increaseFailCount(token);
                }
            } else {
                log.error("FCM FAIL token={} exType={} msg={}",
                        token, ex.getClass().getSimpleName(), ex.getMessage(), ex);
                // 기타 예외도 실패 카운트 증가 등
                // pushTokenRepository.increaseFailCount(token);
            }
        }

        Map<String, Boolean> result = new HashMap<>();
        for(int i = 0; i<tokens.size(); i++) {
            SendResponse r = response.getResponses().get(i);
            result.put(tokens.get(i), r.isSuccessful());
        }

        return result;
    }

    private static String safe(String s) {
        return (s == null) ? "" : s;
    }
}
