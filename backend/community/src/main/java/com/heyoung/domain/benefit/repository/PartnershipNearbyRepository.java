package com.heyoung.domain.benefit.repository;

import com.heyoung.domain.benefit.entity.Category;
import com.heyoung.domain.benefit.entity.Partnership;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PartnershipNearbyRepository extends Repository<Partnership, Long> {

    interface PartnershipNearbyRow {
        Long getPartnershipId();
        Long getCategoryId();
        Double getDistanceMeters();
    }

    @Query(value = """
        SELECT
            p.id AS partnershipId,
            p.category_id AS categoryId,
            MIN(
                ST_DistanceSphere(
                    b.location,
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
                )
            ) AS distanceMeters
        FROM partnership p
        JOIN partnership_branch b ON b.partnership_id = p.id
        WHERE p.status = 'ACTIVE'
          AND b.status = 'ACTIVE'
          AND b.start_date <= :today AND :today <= b.end_date
          AND (
            :catsEmpty = TRUE OR p.category_id IN (:cats)
          )
          AND ST_DWithin(
                b.location::geography,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                :radiusMeters
              )
        GROUP BY p.id, p.company_name, p.category_id
        ORDER BY distanceMeters ASC
        LIMIT :limit
        """, nativeQuery = true)
    List<PartnershipNearbyRow> findNearbyCandidates(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusMeters") int radiusMeters,
            @Param("today") LocalDate today,
            @Param("catsEmpty") boolean catsEmpty,
            @Param("cats") List<Category> cats,
            @Param("limit") int limit
    );
}
