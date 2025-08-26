package com.heyoung.domain.benefit.controller;

import com.heyoung.domain.benefit.dto.BranchInformationDto;
import com.heyoung.domain.benefit.dto.PartnershipBranchDto;
import com.heyoung.domain.benefit.service.PartnershipBranchService;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name="제휴 지점 정보 관련 API", description = "제휴 지점 정보를 조회할 수 있는 API입니다.")
@RestController
@RequestMapping("/partnerships")
public class PartnershipBranchController {

    private final PartnershipBranchService partnershipBranchService;

    public PartnershipBranchController(PartnershipBranchService partnershipBranchService) {
        this.partnershipBranchService = partnershipBranchService;
    }

    @Operation(summary="3. 모든 제휴 지점의 정보를 조회하는 API", description = "모든 제휴 지점의 정보를 조회하는 API입니다.")
    @GetMapping("/{partnershipId}/branches")
    public BaseResponse<List<PartnershipBranchDto>> getAllPartnershipBranches(@PathVariable Long partnershipId) {
        return BaseResponse.onSuccess(partnershipBranchService.findAllPartnershipBranches(partnershipId), ResponseCode.OK);
    }

	@Operation(summary="4. 특정 제휴 지점의 정보를 조회하는 API", description = "특정 제휴 지점의 정보를 조회하는 API입니다.")
	@GetMapping("/{branchId}")
	public BaseResponse<BranchInformationDto> getPartnershipBranch(@PathVariable Long branchId) {
		return BaseResponse.onSuccess(partnershipBranchService.findBranchInformation(branchId), ResponseCode.OK);
	}

}
