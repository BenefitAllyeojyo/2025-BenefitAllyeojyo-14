package com.heyoung.domain.recommendation.dto.request;

import java.time.Instant;

public record SaveUserCategoryRequest(
        long outboxId,
        long userId,
        long categoryId,
        Instant transactionDateTime
) { }
