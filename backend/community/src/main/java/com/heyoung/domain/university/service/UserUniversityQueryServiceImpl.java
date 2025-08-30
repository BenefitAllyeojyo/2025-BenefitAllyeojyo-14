package com.heyoung.domain.university.service;

import com.heyoung.domain.university.entity.FreeSlot;
import com.heyoung.domain.university.entity.University;
import com.heyoung.domain.university.exception.UserUniversityException;
import com.heyoung.domain.university.repository.FreeSlotRepository;
import com.heyoung.domain.university.repository.UserUniversityRepository;
import com.heyoung.global.enums.Weekday;
import com.heyoung.global.exception.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserUniversityQueryServiceImpl implements UserUniversityQueryService {

    private final UserUniversityRepository userUniversityRepository;

    @Override
    public University getUniversityByUserId(Long userId) {
        return userUniversityRepository.findByUserId(userId)
                .orElseThrow(() -> new UserUniversityException(ResponseCode.USER_UNIVERSITY_NOT_FOUND)).getUniversity();
    }
}
