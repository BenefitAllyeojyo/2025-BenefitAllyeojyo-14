package com.heyoung.domain.benefit.repository;

import com.heyoung.domain.benefit.entity.PartnershipBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnershipBranchRepository extends JpaRepository<PartnershipBranch, Long> {

    List<PartnershipBranch> findByPartnershipId(Long partnershipId);

    @Query(value = """
    SELECT p.terms AS terms,
           p.host_name AS hostName,
           p.company_name                      AS partnershipName,
           p.category_id               AS categoryId,
           pb.id AS branchId,
           pb.address AS address,
           ST_Y(pb.location)           AS lat,
           ST_X(pb.location)           AS lng,
           ST_DistanceSphere(
             pb.location,
             ST_SetSRID(ST_MakePoint(:lng,:lat),4326)
           )                           AS distanceM
    FROM partnership_branch pb
    JOIN partnership p ON p.id = pb.partnership_id
    WHERE ST_DWithin(
            pb.location,
            ST_SetSRID(ST_MakePoint(:lng,:lat),4326),
            :radiusM
          )
      AND (:universityId IS NULL OR p.university_id = :universityId)
    ORDER BY distanceM ASC
    LIMIT :limit OFFSET :offset
  """, nativeQuery = true)
    List<NearbyBranchRow> findNearby(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusM") int radiusM,
            @Param("universityId") Long universityId,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    interface NearbyBranchRow {
        Long getBranchId();
        String getTerms();
        String getHostName();
        String getAddress();
        String getPartnershipName();
        Double getLat();
        Double getLng();
    }
}
