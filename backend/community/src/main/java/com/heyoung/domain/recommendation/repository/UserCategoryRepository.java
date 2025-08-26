package com.heyoung.domain.recommendation.repository;

import com.heyoung.domain.recommendation.entity.UserCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCategoryRepository extends JpaRepository<UserCategory, Long> {
    Optional<UserCategory> findByUserIdAndCategoryId(Long userId, Long categoryId);
}
