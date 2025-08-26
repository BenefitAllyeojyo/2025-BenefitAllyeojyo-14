package com.heyoung.domain.notification.entity;

import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.SendStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * 알림이 전송될 때 로그를 남기는 테이블.
 */

@Table(
        name = "notification_log",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_notification_event_uniq_key", columnNames = "uniq_key")
        },
        indexes = {
                @Index(name = "idx_ne_notif_time",      columnList = "notification_id, occurred_at"),
                @Index(name = "idx_ne_user_notif_time", columnList = "user_id, notification_id, occurred_at")
        }
)
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationLog extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SendStatus sendStatus;

    @Column(nullable = false)
    private Instant occurredAt = Instant.now(); // 기본값 현재

    /**
     * 멱등 키 : 중복 전송/재시도/네트워크 지연으로 같은 이벤트가 여러 번 발생할 수 있으므로 한번만 기록 하기 위한 것.
     */
    @Column(nullable = false, length = 160)
    private String uniqKey;


}
