package com.heyoung.domain.payment.controller;

import com.heyoung.domain.payment.dto.UserTotalSavingsDto;
import com.heyoung.domain.payment.service.UserBenefitService;
import com.heyoung.global.config.MemberId;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name="사용자 혜택 사용 정보 API", description = "사용자의 혜택 사용 정보 조회 API입니다.")
@RestController
@RequestMapping("/benefits")
@RequiredArgsConstructor
public class UserBenefitController {
    private final UserBenefitService userBenefitService;


    @Operation(summary="사용자가 아낀 총 금액 조회 API", description = "사용자가 결제 시 할인을 통해 아낀 총 금액을 조회합니다.")
    @GetMapping("/savings")
    public BaseResponse<UserTotalSavingsDto> getUserTotalSavings(@MemberId Long memberId) {
        UserTotalSavingsDto totalSavingsDto = userBenefitService.getTotalSavings(memberId);
        return BaseResponse.onSuccess(totalSavingsDto, ResponseCode.OK);
    }
}
