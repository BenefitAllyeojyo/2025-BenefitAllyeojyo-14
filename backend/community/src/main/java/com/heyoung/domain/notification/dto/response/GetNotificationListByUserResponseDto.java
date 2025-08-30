package com.heyoung.domain.notification.dto.response;

public record GetNotificationListByUserResponseDto(
        Long partnershipId,
        String title,
        String content
) {
}
