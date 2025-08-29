package com.heyoung.domain.notification.dto.request;

import com.heyoung.global.enums.NotificationChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PushTokenDtos {

    public record RegisterRequest(
            @NotNull NotificationChannel channel,
            @NotBlank String token,
            String appVersion,
            String osVersion,
            String deviceVersion
    ) {}

    public record DeactivateRequest(
            @NotNull NotificationChannel channel,
            @NotBlank String token
    ) {}

    public record TokenResponse(
            Long id,
            NotificationChannel channel,
            boolean active
    ) {}
}
