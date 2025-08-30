package com.heyoung.domain.university.service;

import com.heyoung.domain.university.entity.FreeSlot;
import com.heyoung.domain.university.repository.FreeSlotRepository;
import com.heyoung.global.enums.Weekday;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FreeSlotQueryServiceImpl implements FreeSlotQueryService {

    private final FreeSlotRepository freeSlotRepository;

    @Override
    public List<FreeSlot> findTodayFreeSlot(Long userId, Weekday today) {
        return freeSlotRepository.findByUserIdAndDayOfWeekOrderByStartTime(userId, today);
    }
}
