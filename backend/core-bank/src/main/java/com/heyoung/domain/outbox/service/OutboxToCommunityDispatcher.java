package com.heyoung.domain.outbox.service;

import com.heyoung.domain.outbox.entity.Outbox;
import com.heyoung.domain.outbox.publisher.OutboxKafkaPublisher;
import com.heyoung.domain.outbox.repository.OutBoxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ② Safety-net — 저주기 폴링.
 * sent_at IS NULL 인 미전송분을 픽업/리스한 뒤 fast-path 와 동일한 발행 경로
 * (OutboxKafkaPublisher)로 재발행한다. 상태전이는 OutboxStateService(프록시 빈)에 위임한다.
 *
 * 픽업/리스/백오프/재시도(FOR UPDATE SKIP LOCKED, attempt, next_retry_at) 로직은 그대로 유지한다.
 *
 * <p>트랜잭션 경계 주의: 픽업/리스는 짧은 트랜잭션인 {@link OutboxPickService#pickAndLease}(별도 빈)로
 * 커밋한 뒤, 발행({@code send().get()})은 어떤 트랜잭션도 잡지 않은 상태에서 수행한다. 상태전이
 * (markSent/markFailed)는 {@link OutboxStateService} 가 행별로 독립 트랜잭션을 연다. 이렇게 하면
 * DB 커넥션/락을 브로커 왕복 시간 내내 붙잡지 않고, 배치 중간 실패가 이미 발행된 행을 롤백하지 않는다.
 */
@Service @Slf4j
@RequiredArgsConstructor
public class OutboxToCommunityDispatcher {

    private final OutBoxRepository outBoxRepository;
    private final OutboxPickService pickService;
    private final OutboxKafkaPublisher publisher;

    private static final int PICK_LIMIT  = 200; // 한 번에 집을 최대 행 수
    private static final int LEASE_SEC   = 30;  // 다른 워커가 못 집게 막는 임대 시간
    private static final int MAX_ATTEMPT = 5;   // 재시도 컷오프

    @Scheduled(
            fixedDelayString = "${outbox.dispatch.delay-ms:30000}",
            initialDelayString = "${outbox.dispatch.initial-delay-ms:2000}"
    )
    public void run() {
        try {
            dispatchOnce();
        } catch (Exception e) {
            log.error("Outbox dispatch failed", e);
        }
    }

    // 한 번의 디스패치 사이클 (트랜잭션 밖 — 발행은 어떤 트랜잭션도 잡지 않는다)
    public int dispatchOnce() {
        // 1) id 픽업 + 리스 (별도 빈의 짧은 트랜잭션에서 커밋)
        List<Long> ids = pickService.pickAndLease(PICK_LIMIT, LEASE_SEC, MAX_ATTEMPT);
        if (ids.isEmpty()) return 0;

        // 2) 엔티티 로드
        List<Outbox> rows = outBoxRepository.findAllById(ids);

        // 3) 건별 Kafka 재발행 (fast-path 와 동일 경로 공유).
        //    한 행의 실패가 배치 전체를 중단시키지 않도록 건별로 방어한다.
        int acked = 0;
        for (Outbox o : rows) {
            try {
                if (publisher.publishAndConfirm(o)) {
                    acked++;
                }
            } catch (Exception e) {
                log.warn("Outbox publish threw, continuing batch. outboxId={}", o.getId(), e);
            }
        }
        return acked;
    }
}
