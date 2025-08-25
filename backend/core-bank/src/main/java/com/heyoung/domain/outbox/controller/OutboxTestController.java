package com.heyoung.domain.outbox.controller;

import com.heyoung.domain.outbox.dto.response.SaveResponse;
import com.heyoung.domain.outbox.dto.response.TransactionResponseDto;
import com.heyoung.domain.outbox.service.OutBoxCommandService;
import com.heyoung.domain.payment.dto.response.TransactionListResponse;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Tag(name="outbox 테스트", description = "추천 데이터 반영하는 트리거 컨트롤러")
@RestController
@RequiredArgsConstructor
@Slf4j
public class OutboxTestController {
    private final OutBoxCommandService outBoxCommandService;

    @Operation(summary="outbox/transaction 테스트")
    @PostMapping(path = "/outbox/transaction")
    public BaseResponse<SaveResponse> updateUserCategory() {
        TransactionResponseDto transactionResponseDto = new TransactionResponseDto(1L, 1L, Instant.now());
        outBoxCommandService.saveTransactionOutBox(transactionResponseDto);
        return BaseResponse.onSuccess(new SaveResponse(null), ResponseCode.OK);
    }

    @Operation(summary="outbox/payment 테스트")
    @PostMapping(path = "/outbox/payment")
    public BaseResponse<SaveResponse> updateUserHourHist() {
        log.warn("/outbox/payment");
        TransactionListResponse data = TransactionListResponse.builder().userId(1L).transactionTime(Instant.now()).build();
        List<TransactionListResponse> list = new ArrayList<>();
        list.add(data);

        outBoxCommandService.saveAccountOutBox(list);
        return BaseResponse.onSuccess(new SaveResponse(null), ResponseCode.OK);
    }
}
