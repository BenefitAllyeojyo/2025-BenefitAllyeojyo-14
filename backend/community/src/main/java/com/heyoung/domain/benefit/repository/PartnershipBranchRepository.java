package com.heyoung.domain.benefit.repository;

import com.heyoung.domain.benefit.entity.PartnershipBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnershipBranchRepository extends JpaRepository<PartnershipBranch, Long> {
    List<PartnershipBranch> findByPartnershipId(Long partnershipId);
}
