package com.heyoung.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@AllArgsConstructor
public class TransactionResponseDto { // 서버 -> 가맹점 결제 결과
    private Long transactionId;
    private String status;
    private BigDecimal finalAmount; // 최종 결제 금액
    private BigDecimal discountAmount;
    private Instant transactionDateTime;
}
