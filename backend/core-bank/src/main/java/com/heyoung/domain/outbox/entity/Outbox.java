package com.heyoung.domain.outbox.entity;

import com.heyoung.domain.outbox.enums.DeliveryErrorType;
import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.OutboxType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity
@Getter @Setter
@Builder
@Table(
        name = "outbox",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_outbox_uniq_key", columnNames = "uniq_key")
        },
        indexes = {
                @Index(name = "idx_outbox_sendable_hint", columnList = "sent_at, next_retry_at, id"),
                @Index(name = "idx_outbox_created_date", columnList = "created_date")
        }
)
@NoArgsConstructor
@AllArgsConstructor
public class Outbox extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private OutboxType type;

    @Column(nullable = false, columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String payload; // 수신측에 보낼 JSON 문자열

    @Column(nullable = false, columnDefinition = "timestamptz")
    private Instant occurredAt;

    @Column(nullable = false, unique = true, length = 160)
    private String uniqKey;

    @Column(nullable = false)
    @Builder.Default
    private Integer attempt = 0;

    @Column(columnDefinition = "timestamptz")
    private Instant nextRetryAt;

    @Column(columnDefinition = "timestamptz")
    private Instant sentAt;

    @Enumerated(EnumType.STRING)
    @Column
    private DeliveryErrorType lastError; // 마지막 전송이 실패한 이유
}
