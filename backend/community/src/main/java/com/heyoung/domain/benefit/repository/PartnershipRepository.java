package com.heyoung.domain.benefit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.heyoung.domain.benefit.entity.Partnership;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnershipRepository extends JpaRepository<Partnership, Long> {
    List<Partnership> findByUniversityId(Long universityId);

    // fetch join -> partnership과 university 함께 조회하는 jpql 쿼리(n+1 문제 해결)
    @Query("SELECT p FROM Partnership p JOIN FETCH p.university")
    List<Partnership> findAllWithUniversity();
}
