package com.heyoung.domain.payment.repository;

import com.heyoung.domain.payment.entity.UserBenefitHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBenefitHistoryRepository extends JpaRepository<UserBenefitHistory, Long> {
}
