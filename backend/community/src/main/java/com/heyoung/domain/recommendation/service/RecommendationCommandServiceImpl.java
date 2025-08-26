package com.heyoung.domain.recommendation.service;

import com.heyoung.domain.benefit.service.CategoryQueryService;
import com.heyoung.domain.benefit.entity.Category;
import com.heyoung.domain.recommendation.dto.request.SaveUserCategoryRequest;
import com.heyoung.domain.recommendation.dto.request.SaveUserHourHistRequest;
import com.heyoung.domain.recommendation.dto.response.FailedResponseDto;
import com.heyoung.domain.recommendation.dto.response.SaveResponse;
import com.heyoung.domain.recommendation.entity.EventConsumeLog;
import com.heyoung.domain.recommendation.entity.UserCategory;
import com.heyoung.domain.recommendation.entity.UserHourHist;
import com.heyoung.domain.recommendation.repository.EventConsumeLogRepository;
import com.heyoung.domain.recommendation.repository.UserCategoryRepository;
import com.heyoung.domain.recommendation.repository.UserHourHistRepository;
import com.heyoung.global.enums.HourBucket;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecommendationCommandServiceImpl implements RecommendationCommandService {

    private final UserCategoryRepository userCategoryRepository;
    private final UserHourHistRepository userHourHistRepository;
    private final CategoryQueryService categoryQueryService;
    private final EventConsumeLogRepository eventConsumeLogRepository;

    @Override
    @Transactional
    public BaseResponse<SaveResponse> receiveUserCategory(List<SaveUserCategoryRequest> saveUserCategoryRequestList) {

        List<FailedResponseDto> failed = new ArrayList<>();

        for(SaveUserCategoryRequest data : saveUserCategoryRequestList) {
            try {
                if (eventConsumeLogRepository.existsByOutboxId(data.outboxId())) {
                    continue;
                }

                // 선호 카테고리 반영
                updateUserCategory(userCategoryRepository.findByUserIdAndCategoryId(data.userId(), data.categoryId()), data.userId(), data.categoryId());

                // 선호 시간대 반영
                HourBucket hourBucket = HourBucket.of(changeToHour(data.transactionDateTime()));
                updateUserHourHist(getUserHourHist(data.userId(), hourBucket), data.userId(), hourBucket);

                eventConsumeLogRepository.save(EventConsumeLog.builder().outboxId(data.outboxId()).build());

            } catch (Exception e) {
                failed.add(new FailedResponseDto(data.outboxId(), e.getMessage()));
            }
        }

        return failed.isEmpty() ? BaseResponse.onSuccess(new SaveResponse(null), ResponseCode.OK) : BaseResponse.onFailure(new SaveResponse(failed), ResponseCode.OK);

    }

    @Override
    @Transactional
    public BaseResponse<SaveResponse> receiveUserHourHist(List<SaveUserHourHistRequest> saveUserHourHistRequestList) {

        List<FailedResponseDto> failed = new ArrayList<>();

        for (SaveUserHourHistRequest data : saveUserHourHistRequestList) {
            try {
                if (eventConsumeLogRepository.existsByOutboxId(data.outboxId())) {
                    continue;
                }

                HourBucket hourBucket = HourBucket.of(changeToHour(data.transactionTime()));
                Optional<UserHourHist> found = getUserHourHist(data.userId(), hourBucket);

                updateUserHourHist(found, data.userId(), hourBucket);

                eventConsumeLogRepository.save(EventConsumeLog.builder().outboxId(data.outboxId()).build());

            } catch (Exception e) {
                failed.add(new FailedResponseDto(data.outboxId(), e.getMessage()));
            }
        }

        return failed.isEmpty() ? BaseResponse.onSuccess(new SaveResponse(null), ResponseCode.OK) : BaseResponse.onFailure(new SaveResponse(failed), ResponseCode.OK);

    }

    private Optional<UserHourHist> getUserHourHist(Long userId, HourBucket hourBucket) {
        return userHourHistRepository.findByUserIdAndHourBucket(userId, hourBucket);
    }

    private int changeToHour(Instant instant) {
        // 1) 서울 시간의 시:분:초
        ZoneId seoul = ZoneId.of("Asia/Seoul");
        LocalTime lt = instant.atZone(seoul).toLocalTime();

        return lt.getHour();
    }

    private void updateUserHourHist(Optional<UserHourHist> found, Long userId, HourBucket hourBucket) {
        if (found.isPresent()) {
            found.get().plusUseCount();
        } else {
            UserHourHist userHourHist = UserHourHist.from(userId, hourBucket);
            userHourHistRepository.save(userHourHist);
        }
    }

    private void updateUserCategory(Optional<UserCategory> found, Long userId, Long categoryId) {
        if (found.isPresent()) {
            found.get().plusUseCount();
        } else {
            Category category = categoryQueryService.findById(categoryId);
            UserCategory userCategory = UserCategory.from(userId, category);
            userCategoryRepository.save(userCategory);
        }
    }
}
