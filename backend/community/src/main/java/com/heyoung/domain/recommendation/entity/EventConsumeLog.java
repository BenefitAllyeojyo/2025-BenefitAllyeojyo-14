package com.heyoung.domain.recommendation.entity;

import com.heyoung.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "event_consume_log",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_consume_outbox", columnNames = "outbox_id")
        }
)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventConsumeLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "outbox_id", nullable = false)
    private Long outboxId;

    public static EventConsumeLog of(Long outboxId) {
        return EventConsumeLog.builder()
                .outboxId(outboxId)
                .build();
    }

}
