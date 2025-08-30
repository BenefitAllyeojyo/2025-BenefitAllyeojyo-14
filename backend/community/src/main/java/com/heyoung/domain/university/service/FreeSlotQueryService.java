package com.heyoung.domain.university.service;

import com.heyoung.domain.university.entity.FreeSlot;
import com.heyoung.global.enums.Weekday;

import java.util.List;

public interface FreeSlotQueryService {
    List<FreeSlot> findTodayFreeSlot(Long userId, Weekday today);
}
