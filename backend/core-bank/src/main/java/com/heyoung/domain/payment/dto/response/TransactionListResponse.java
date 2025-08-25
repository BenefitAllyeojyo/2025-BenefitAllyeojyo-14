package com.heyoung.domain.payment.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class TransactionListResponse { // 계좌 연동 후 OutboxService 에 전달해야 할 데이터 응답
    private long userId;
    private Instant transactionTime;
}
