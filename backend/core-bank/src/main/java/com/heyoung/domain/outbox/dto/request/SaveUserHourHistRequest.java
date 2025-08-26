package com.heyoung.domain.outbox.dto.request;

import java.time.Instant;

public record SaveUserHourHistRequest(
        long outboxId,
        long userId,
        Instant transactionTime
) { }
