package com.heyoung.domain.outbox.repository;

import com.heyoung.domain.outbox.entity.Outbox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OutBoxRepository extends JpaRepository<Outbox, Long> {

    // (1) 픽업: attempt NULL 방어 + 트랜잭션에서만 의미 있는 FOR UPDATE
    @Query(value = """
        select id
          from outbox
         where sent_at is null
           and (next_retry_at is null or next_retry_at <= now())
           and coalesce(attempt, 0) < :maxAttempt
         order by id
         for update skip locked
         limit :limit
    """, nativeQuery = true)
    List<Long> lockAndPickIds(@Param("limit") int limit, @Param("maxAttempt") int maxAttempt);

    // (2) 리스 걸기: clear/flush 옵션 권장
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        update outbox
           set next_retry_at = now() + (:leaseSec * interval '1 second')
         where id in (:ids)
    """, nativeQuery = true)
    int leaseByIds(@Param("ids") List<Long> ids, @Param("leaseSec") int leaseSec);

}
