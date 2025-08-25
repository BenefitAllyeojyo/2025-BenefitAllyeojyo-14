package com.heyoung.domain.recommendation.dto.request;

import java.time.Instant;

public record SaveUserHourHistRequest(
        long outboxId,
        long userId,
        Instant transactionTime
) { }
