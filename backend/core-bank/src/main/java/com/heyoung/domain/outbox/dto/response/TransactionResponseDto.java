package com.heyoung.domain.outbox.dto.response;

import java.time.Instant;

// 결제하고 난 다음 전해줘야 하는 데이터들
// 커뮤니티 쪽에서는 결제 후 결제 시간대, 결제한 업종 정도만 알면 됨.
public record TransactionResponseDto(
        long userId,
        long categoryId,
        Instant transactionDateTime
) {}
