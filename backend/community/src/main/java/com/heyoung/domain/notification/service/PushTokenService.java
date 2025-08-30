package com.heyoung.domain.notification.service;

import com.heyoung.domain.notification.dto.request.PushTokenDtos;
import com.heyoung.domain.notification.entity.PushToken;
import com.heyoung.global.enums.NotificationChannel;

public interface PushTokenService {
    PushToken register(Long userId, PushTokenDtos.RegisterRequest request);
    PushToken deactivate(Long userId, NotificationChannel channel, String token);
}
