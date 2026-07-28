package com.heyoung.domain.outbox.event;

import java.util.List;

/**
 * outbox row 가 저장된 트랜잭션 안에서 발행되는 도메인 이벤트.
 * AFTER_COMMIT 리스너가 이 이벤트를 받아 fast-path(Kafka 즉시 발행)를 트리거한다.
 */
public record OutboxRecorded(List<Long> ids) { }
