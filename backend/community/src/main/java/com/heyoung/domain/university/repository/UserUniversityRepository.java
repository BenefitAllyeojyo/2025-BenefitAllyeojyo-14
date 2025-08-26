package com.heyoung.domain.university.repository;

import com.heyoung.domain.university.entity.UserUniversity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserUniversityRepository extends JpaRepository<UserUniversity, Long> {
    Optional<UserUniversity> findByUserId(Long userId);
}
