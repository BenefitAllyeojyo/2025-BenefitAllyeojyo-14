package com.heyoung.domain.university.service;

import com.heyoung.domain.university.entity.FreeSlot;
import com.heyoung.domain.university.entity.University;
import com.heyoung.global.enums.Weekday;

import java.util.List;

public interface UserUniversityQueryService {
    University getUniversityByUserId(Long universityId);
}
