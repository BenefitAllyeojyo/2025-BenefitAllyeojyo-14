package com.heyoung.domain.payment.repository;

import com.heyoung.domain.payment.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
