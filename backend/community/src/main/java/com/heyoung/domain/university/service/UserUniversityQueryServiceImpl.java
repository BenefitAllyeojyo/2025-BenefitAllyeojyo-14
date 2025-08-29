package com.heyoung.domain.university.service;

import com.heyoung.domain.university.entity.University;
import com.heyoung.domain.university.exception.UserUniversityException;
import com.heyoung.domain.university.repository.UserUniversityRepository;
import com.heyoung.global.exception.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
