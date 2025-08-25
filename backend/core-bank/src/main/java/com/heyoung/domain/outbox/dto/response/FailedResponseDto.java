package com.heyoung.domain.outbox.dto.response;

public record FailedResponseDto(
    Long outboxId,
    String errorMessage
) { }
