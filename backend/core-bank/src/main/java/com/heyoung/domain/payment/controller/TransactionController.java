package com.heyoung.domain.payment.controller;

import com.heyoung.domain.payment.dto.QrDataDto;
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
    public BaseResponse<QrDataDto> getQrData(@MemberId Long memberId) {
        QrDataDto qrData = transactionService.generateQrData(memberId);
        return BaseResponse.onSuccess(qrData, ResponseCode.OK);
    }

}
