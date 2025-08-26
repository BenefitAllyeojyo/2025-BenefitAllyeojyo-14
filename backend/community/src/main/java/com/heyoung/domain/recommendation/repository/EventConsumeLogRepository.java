package com.heyoung.domain.recommendation.repository;

import com.heyoung.domain.recommendation.entity.EventConsumeLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventConsumeLogRepository extends JpaRepository<EventConsumeLog, Long> {
    boolean existsByOutboxId(Long outboxId);
}
