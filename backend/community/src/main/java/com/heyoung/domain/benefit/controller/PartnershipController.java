package com.heyoung.domain.benefit.controller;

import com.heyoung.domain.benefit.dto.PartnershipDto;
import com.heyoung.domain.benefit.service.PartnershipService;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import com.heyoung.global.webconfig.MemberId;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;

@Tag(name="제휴 정보 관련 API", description = "제휴 정보를 조회할 수 있는 API입니다.")
@RestController
@RequestMapping("/partnerships")
public class PartnershipController {

    private final PartnershipService partnershipService;

    public PartnershipController(PartnershipService partnershipService) {
        this.partnershipService = partnershipService;
    }

    @Operation(summary="사용자 대학의 제휴 정보를 조회하는 API", description = "사용자 대학의 제휴 정보를 조회하는 API입니다.")
    @GetMapping("/university")
    public BaseResponse<List<PartnershipDto>> getPartnerships(@MemberId Long memberId) {
        return BaseResponse.onSuccess(partnershipService.findPartnerships(memberId), ResponseCode.OK);
    }

}
