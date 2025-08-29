package com.heyoung.domain.benefit.repository;

import com.heyoung.domain.benefit.entity.UniversityPartnership;
import com.heyoung.domain.university.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UniversityPartnershipRepository extends JpaRepository<UniversityPartnership, Long> {
    List<UniversityPartnership> findTop5ByUniversityOrderByUseCountDesc(University university);
}
