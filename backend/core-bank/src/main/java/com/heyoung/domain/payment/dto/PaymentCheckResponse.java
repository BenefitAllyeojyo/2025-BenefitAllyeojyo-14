package com.heyoung.domain.payment.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCheckResponse {
	private boolean success;
	private BigDecimal finalAmount;
	private BigDecimal originalAmount;
	private String partnershipBranchName;
}
