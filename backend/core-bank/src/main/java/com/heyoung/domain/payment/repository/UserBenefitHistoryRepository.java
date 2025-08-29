package com.heyoung.domain.payment.repository;

import com.heyoung.domain.payment.entity.UserBenefitHistory;
import com.heyoung.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface UserBenefitHistoryRepository extends JpaRepository<UserBenefitHistory, Long> {
    // 사용자의 총 혜택 적용 금액(아낀 금액) 조회
    @Query("SELECT SUM(ubh.appliedAmount) FROM UserBenefitHistory ubh WHERE ubh.userId = :user")
    BigDecimal findTotalAppliedAmountByUser(@Param("user") User user);
}
