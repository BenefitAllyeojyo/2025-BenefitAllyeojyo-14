package com.heyoung.domain.benefit.repository;

import com.heyoung.domain.benefit.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import com.heyoung.domain.benefit.entity.Partnership;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnershipRepository extends JpaRepository<Partnership, Long> {
    List<Partnership> findByUniversityId(Long universityId);

    // fetch join -> partnership과 university 함께 조회하는 jpql 쿼리(n+1 문제 해결)
    @Query("SELECT p FROM Partnership p JOIN FETCH p.university")
    List<Partnership> findAllWithUniversity();

    @Query("""
      select distinct p
      from Partnership p
      where p.status = com.heyoung.global.enums.PartnershipStatus.ACTIVE
        and p.category in :cats
        and exists (
          select b.id
          from PartnershipBranch b
          where b.partnership = p
            and b.status = com.heyoung.global.enums.PartnershipStatus.ACTIVE
            and b.startDate <= :today and :today <= b.endDate
        )
        and not exists (
          select nl2.id
          from NotificationLog nl2
          where nl2.userId = :userId
            and nl2.occurredAt >= :cutoff
            and nl2.notification.partnership = p
        )
      order by p.id desc
    """)
    List<Partnership> findActiveByCategoriesExcludeSent(
            @Param("cats")  List<Category> cats,
            @Param("today") java.time.LocalDate today,
            @Param("userId") Long userId,
            @Param("cutoff") java.time.Instant cutoff
    );
    /** 사용법.
     * LocalDate today  = LocalDate.now(ZoneId.of("Asia/Seoul"));
     * Instant cutoff = Instant.now().minus(7, ChronoUnit.DAYS);
     *
     * List<Partnership> res = partnershipRepository.findActiveByCategoriesExcludeSent(
     *     top3CategoryCodes, today, userId, cutoff, PartnershipStatus.ACTIVE
     * );
     */
}
