package com.heyoung.domain.recommendation.dto.response;

public record FailedResponseDto(
    Long outboxId,
    String errorMessage
) { }
