package com.heyoung.domain.payment.dto;

import java.math.BigDecimal;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
	private Long transactionId;
	private String status;
	private BigDecimal finalAmount; // 최종 결제 금액
	private BigDecimal discountAmount;
	private Instant transactionDateTime;
}
