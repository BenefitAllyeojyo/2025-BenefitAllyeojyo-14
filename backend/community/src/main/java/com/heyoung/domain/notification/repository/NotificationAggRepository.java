package com.heyoung.domain.notification.repository;

import com.heyoung.domain.benefit.entity.Category;
import com.heyoung.domain.benefit.entity.Partnership;
import com.heyoung.domain.notification.entity.NotificationLog;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface NotificationAggRepository extends Repository<NotificationLog, Long> {

    interface CategoryCountRow {
        Long getCategoryId();
        Long getCnt();
    }

    interface PartnershipCountRow {
        Long getPartnershipId();
        Long getCnt();
    }

    // 24시간 내 사용자별 카테고리 노출수 (과다 노출 패널티용)
    @Query("""
        select p.category.id as categoryId, count(nl) as cnt
        from NotificationLog nl
          join nl.notification n
          join n.partnership p
        where nl.userId = :userId
          and nl.occurredAt >= :since
        group by p.category.id
        """)
    List<CategoryCountRow> countUserCategoryExposedLast24h(@Param("userId") Long userId,
                                                           @Param("since") Instant since);

    // 최근 7일 제휴별 전체 노출수 (인기 척도 대용; 결제/조회 로그가 있으면 거기로 교체)
    @Query("""
        select n.partnership.id as partnershipId, count(nl) as cnt
        from NotificationLog nl
          join nl.notification n
        where nl.occurredAt >= :since
        group by n.partnership.id
        """)
    List<PartnershipCountRow> countPartnershipExposedLast7d(@Param("since") Instant since);

}
