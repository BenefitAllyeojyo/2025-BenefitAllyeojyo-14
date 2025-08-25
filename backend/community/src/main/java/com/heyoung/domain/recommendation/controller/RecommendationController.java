package com.heyoung.domain.recommendation.controller;

import com.heyoung.domain.recommendation.dto.request.SaveUserCategoryRequest;
import com.heyoung.domain.recommendation.dto.request.SaveUserHourHistRequest;
import com.heyoung.domain.recommendation.dto.response.SaveResponse;
import com.heyoung.domain.recommendation.service.RecommendationCommandService;
import com.heyoung.global.exception.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name="추천 데이터 반영 API", description = "추천 데이터 반영하는 API입니다.")
@RestController
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationCommandService recommendationCommandService;

    @Operation(summary="결제가 완료된 후 corebank 에서 호출하는 API 입니다.", description = "결제에서 카테고리와 결제 시간대를 받아서, 선호도를 반영합니다.")
    @PostMapping(path = "/recommendations/category", consumes = "application/json")
    public BaseResponse<SaveResponse> updateUserCategory(@RequestBody List<SaveUserCategoryRequest> saveUserCategoryRequestList) {
        return recommendationCommandService.receiveUserCategory(saveUserCategoryRequestList);
    }

    @Operation(summary="결제 수단 연동이 완료된 후 corebank 에서 호출하는 API 입니다.", description = "계좌 내역에서 결제 시간대를 받아서, 알림 발송 시간대 선호도를 반영합니다.")
    @PostMapping(path = "/recommendations/hour", consumes = "application/json")
    public BaseResponse<SaveResponse> updateUserHourHist(@RequestBody List<SaveUserHourHistRequest> saveUserHourHistRequestList) {
        return recommendationCommandService.receiveUserHourHist(saveUserHourHistRequestList);
    }
}
