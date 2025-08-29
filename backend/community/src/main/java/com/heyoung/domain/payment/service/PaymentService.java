package com.heyoung.domain.payment.service;

import org.springframework.stereotype.Service;

import com.heyoung.domain.payment.client.TransactionClient;
import com.heyoung.domain.payment.dto.PaymentRequestDto;
import com.heyoung.domain.payment.dto.PaymentResponseDto;
import com.heyoung.domain.payment.dto.QrDataDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
	private final TransactionClient transactionClient;

	public QrDataDto generateQrData(Long memberId) {
		return transactionClient.requestQrData(memberId);
	}

	public PaymentResponseDto executeTransaction(PaymentRequestDto requestDto) {
		return transactionClient.executePayment(requestDto);
	}
}
