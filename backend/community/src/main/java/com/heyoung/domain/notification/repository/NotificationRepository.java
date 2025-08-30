package com.heyoung.domain.notification.repository;

import com.heyoung.domain.benefit.entity.Partnership;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.global.enums.NotificationChannel;
import com.heyoung.global.enums.SendStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 채널 필터 없이 due
    List<Notification> findTop100BySendStatusAndScheduledAtBeforeOrderByScheduledAtAsc(
            SendStatus sendStatus, Instant before);

    boolean existsByUserIdAndPartnershipAndScheduledAtBetween(
            Long userId, Partnership partnership, Instant from, Instant to
    );

    // 테스트용
    /** 지금 보낼 것(스케줄 시각 지났고 아직 미발송) */
    @Query("""
        select n from Notification n
        where n.userId = :userId
          and n.scheduledAt <= :now
          and (n.sendStatus is null or n.sendStatus <> com.heyoung.global.enums.SendStatus.SENT)
        order by n.scheduledAt asc
    """)
    List<Notification> findDueForUser(@Param("userId") Long userId,
                                      @Param("now") Instant now);

    /** 최근 생성기준(테스트용 목록 조회) */
    @Query("""
        select n from Notification n
        where n.userId = :userId
        order by n.createdDate desc
    """)
    List<Notification> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /** 스케줄 내림차순 목록 조회 */
    Page<Notification> findByUserIdAndSendStatus(Long userId, SendStatus sendStatus, Pageable pageable);
}
