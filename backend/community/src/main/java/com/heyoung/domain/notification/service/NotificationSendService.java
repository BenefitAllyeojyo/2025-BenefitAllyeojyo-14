package com.heyoung.domain.notification.service;

public interface NotificationSendService {
    /**
     * 해당 유저의 "발송 시각이 지났고 아직 미발송"인 예약을 최대 limit개 전송.
     * @return 성공적으로 보낸 개수
     */
    int sendDueForUser(Long userId);
}
