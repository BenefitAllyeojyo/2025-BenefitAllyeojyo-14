package com.heyoung.domain.payment.controller;

import com.heyoung.domain.payment.dto.QrTokenDto;
import com.heyoung.domain.payment.dto.TransactionRequestDto;
import com.heyoung.domain.payment.dto.TransactionResponseDto;
import com.heyoung.domain.payment.service.TransactionService;
import com.heyoung.global.config.MemberId;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name="거래 및 결제 API", description = "QR 데이터 생성 및 결제 실행을 담당합니다.")
@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @Operation(summary="결제 QR 화면 요청 API", description = "사용자가 '결제하기' 버튼을 누르면 호출됩니다.")
    @GetMapping("/qr-data")
    public BaseResponse<QrTokenDto> getQrData(@MemberId Long memberId) {
        QrTokenDto qrTokenDto = transactionService.generateQrData(memberId);
        return BaseResponse.onSuccess(qrTokenDto, ResponseCode.OK);
    }
    @Operation(summary="결제 실행 API", description = "가맹점 POS기에서 QR 스캔 후 호출하는 API입니다.")
    @PostMapping("/execute")
    public BaseResponse<TransactionResponseDto> executePayment(@RequestBody TransactionRequestDto requestDto) {
        // 가맹점으로부터 결제 요청을 받아 처리
        TransactionResponseDto response = transactionService.executeTransaction(requestDto);
        return BaseResponse.onSuccess(response, ResponseCode.OK);
    }
}
