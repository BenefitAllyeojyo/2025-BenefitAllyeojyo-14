package com.heyoung.domain.payment.service;

import org.springframework.stereotype.Service;

import com.heyoung.domain.benefit.entity.PartnershipBranch;
import com.heyoung.domain.benefit.repository.PartnershipBranchRepository;
import com.heyoung.domain.payment.client.TransactionClient;
import com.heyoung.domain.payment.client.TransactionRequestDto;
import com.heyoung.domain.payment.dto.PaymentRequestDto;
import com.heyoung.domain.payment.dto.PaymentResponseDto;
import com.heyoung.domain.payment.dto.QrDataDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
	private final TransactionClient transactionClient;
	private final PartnershipBranchRepository partnershipBranchRepository;

	public QrDataDto generateQrData(Long memberId) {
		return transactionClient.requestQrData(memberId);
	}

	public PaymentResponseDto executeTransaction(PaymentRequestDto requestDto) {
		PartnershipBranch partnership = partnershipBranchRepository.findById(requestDto.getPartnershipBranchId())
			.orElseThrow(() -> new IllegalArgumentException("Invalid partnershipBranchId"));

		TransactionRequestDto transactionRequestDto = new TransactionRequestDto(
			requestDto,
			partnership.getPartnership().getId(),
			partnership.getName(),
			partnership.getPartnership().getCategory().getId()
		);

		return transactionClient.executePayment(transactionRequestDto);
	}
}
