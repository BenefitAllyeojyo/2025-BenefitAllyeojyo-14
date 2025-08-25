package com.heyoung.domain.recommendation.repository;

import com.heyoung.domain.recommendation.entity.UserHourHist;
import com.heyoung.global.enums.HourBucket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserHourHistRepository extends JpaRepository<UserHourHist, Long> {
    Optional<UserHourHist> findByUserIdAndHourBucket(Long userId, HourBucket hourBucket);
}
