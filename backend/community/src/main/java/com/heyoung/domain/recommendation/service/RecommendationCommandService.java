package com.heyoung.domain.recommendation.service;

import com.heyoung.domain.recommendation.dto.request.SaveUserCategoryRequest;
import com.heyoung.domain.recommendation.dto.request.SaveUserHourHistRequest;
import com.heyoung.domain.recommendation.dto.response.SaveResponse;
import com.heyoung.global.exception.BaseResponse;

import java.util.List;

public interface RecommendationCommandService {
    BaseResponse<SaveResponse> receiveUserCategory(List<SaveUserCategoryRequest> saveUserCategoryRequestList);
    BaseResponse<SaveResponse> receiveUserHourHist(List<SaveUserHourHistRequest> saveUserHourHistRequestList);
}
