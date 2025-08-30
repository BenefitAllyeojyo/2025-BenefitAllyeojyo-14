package com.heyoung.domain.payment.controller;

import com.heyoung.domain.payment.dto.AccountBalanceDto;
import com.heyoung.domain.payment.service.AccountService;
import com.heyoung.global.config.MemberId;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name="계좌 정보 API", description = "사용자 계좌 정보 조회를 담당합니다.")
@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @Operation(summary="사용자 계좌 잔액 조회 API", description = "현재 사용자의 계좌 잔액을 실시간으로 조회합니다.")
    @GetMapping("/balance")
    public BaseResponse<AccountBalanceDto> getMyAccountBalance(@MemberId Long memberId) {
        AccountBalanceDto accountBalance = accountService.getAccountBalance(memberId);
        return BaseResponse.onSuccess(accountBalance, ResponseCode.OK);
    }
}