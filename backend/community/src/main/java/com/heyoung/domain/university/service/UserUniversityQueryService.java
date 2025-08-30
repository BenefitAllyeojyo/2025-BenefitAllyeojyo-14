package com.heyoung.domain.university.service;

import com.heyoung.domain.university.entity.University;

public interface UserUniversityQueryService {
    University getUniversityByUserId(Long universityId);
}
