package com.heyoung.domain.notification.repository;

import com.heyoung.domain.notification.entity.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Set;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    /**
     * 최근 cutoff 이후, 해당 사용자가 받은 알림 중 제휴가 연결된 것의 partnershipId 목록.
     * - SendStatus 조건을 더 넣고 싶으면 and nl.sendStatus = ... 추가하면 됨.
     */
    @Query("""
        select distinct n.partnership.id
        from NotificationLog nl
        join nl.notification n
        where nl.userId = :userId
          and nl.occurredAt >= :cutoff
          and n.partnership is not null
    """)
    Set<Long> findSentPartnershipIdsSince(@Param("userId") Long userId,
                                          @Param("cutoff") Instant cutoff);

    boolean existsByUniqKey(String uniqKey);
}
