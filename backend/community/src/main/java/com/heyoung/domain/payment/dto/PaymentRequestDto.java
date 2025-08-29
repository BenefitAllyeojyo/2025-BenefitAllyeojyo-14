package com.heyoung.domain.payment.dto;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class PaymentRequestDto {
	private Long userId;
	private String accountNumber; // 계좌번호
	private BigDecimal finalAmount; // 최종 결제 금액
	private BigDecimal originalAmount; // 할인 전 금액
	private String transactionSummary; // 출금 계좌 요약

	// 거래 기록을 위한 추가 정보
	private Long partnershipId;
	private Long partnershipBranchId;
	private String merchantName;
	private Long categoryId;
}
