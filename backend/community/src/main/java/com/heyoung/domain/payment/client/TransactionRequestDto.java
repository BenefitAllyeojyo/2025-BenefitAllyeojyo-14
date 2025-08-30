package com.heyoung.domain.payment.client;

import java.math.BigDecimal;

import com.heyoung.domain.payment.dto.PaymentRequestDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequestDto { // 가맹점 -> 서버 결제 요청 (QR 찍기)
	private String qrToken; // 사용자 qrToken
	private BigDecimal finalAmount; // 최종 결제 금액
	private BigDecimal originalAmount; // 할인 전 금액
	private String transactionSummary; // 출금 계좌 요약

	// 거래 기록을 위한 추가 정보
	private Long partnershipId;
	private Long partnershipBranchId;
	private String merchantName;
	private Long categoryId;

	public TransactionRequestDto(PaymentRequestDto requestDto, Long partnershipId, String merchantName, Long categoryId) {
		this.qrToken = requestDto.getQrToken();
		this.finalAmount = requestDto.getFinalAmount();
		this.originalAmount = requestDto.getOriginalAmount();
		this.transactionSummary = requestDto.getTransactionSummary();
		this.partnershipBranchId = requestDto.getPartnershipBranchId();
		this.partnershipId = partnershipId;
		this.merchantName = merchantName;
		this.categoryId = categoryId;

	}
}
