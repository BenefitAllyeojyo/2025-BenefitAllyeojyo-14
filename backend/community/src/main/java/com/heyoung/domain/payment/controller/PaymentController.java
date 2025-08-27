package com.heyoung.domain.payment.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.heyoung.domain.payment.dto.QrDataDto;
import com.heyoung.domain.payment.dto.PaymentRequestDto;
import com.heyoung.domain.payment.dto.PaymentResponseDto;
import com.heyoung.domain.payment.service.PaymentService;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import com.heyoung.global.webconfig.MemberId;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name="헤이영 결제 API", description = "QR 데이터 생성 및 결제 실행을 담당합니다.")
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService transactionService;

	@Operation(summary="결제 QR 화면 요청 API", description = "사용자가 '결제하기' 버튼을 누르면 호출됩니다.")
	@GetMapping("/qr-data")
	public BaseResponse<QrDataDto> getQrData(@MemberId Long memberId) {
		QrDataDto qrData = transactionService.generateQrData(memberId);
		return BaseResponse.onSuccess(qrData, ResponseCode.OK);
	}
	@Operation(summary="결제 실행 API", description = "가맹점 POS기에서 QR 스캔 후 호출하는 API입니다.")
	@PostMapping("/execute")
	public BaseResponse<PaymentResponseDto> executePayment(@RequestBody PaymentRequestDto requestDto) {
		// 가맹점으로부터 결제 요청을 받아 처리
		PaymentResponseDto response = transactionService.executeTransaction(requestDto);
		return BaseResponse.onSuccess(response, ResponseCode.OK);
	}
}
