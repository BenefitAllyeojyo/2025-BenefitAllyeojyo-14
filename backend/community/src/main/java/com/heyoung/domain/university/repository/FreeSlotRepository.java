package com.heyoung.domain.university.repository;

import com.heyoung.domain.university.entity.FreeSlot;
import com.heyoung.global.enums.Weekday;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.List;

public interface FreeSlotRepository extends JpaRepository<FreeSlot, Long> {
    List<FreeSlot> findByUserIdAndDayOfWeekOrderByStartTime(Long userId, Weekday weekday);

    boolean existsByUserIdAndDayOfWeekAndStartTimeAndEndTime(Long userId, Weekday day, LocalTime start, LocalTime end);
}
