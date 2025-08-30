package com.heyoung.domain.notification.dto.response;

/**
 * 단 건 조회이므로, 기존에 한 개만 있는 경우
 * 제휴 -> 안 읽은 것 중 최근, 다 읽었다 최근
 * 브랜치 -> 위치가 가장 가까운 것, 반경을 넓게 잡기
 * @param partnershipBranchId
 */
public record GetNotificationByRemindResponseDto(
        Long partnershipBranchId,
        String partnershipBranchName,
        String content,
        Double lat,
        Double lan
) { }
