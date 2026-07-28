package com.heyoung.domain.outbox.listener;

import com.heyoung.domain.outbox.entity.Outbox;
import com.heyoung.domain.outbox.event.OutboxRecorded;
import com.heyoung.domain.outbox.publisher.OutboxKafkaPublisher;
import com.heyoung.domain.outbox.repository.OutBoxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

/**
 * fast-path 트리거.
 * outbox 저장 트랜잭션이 커밋된 뒤(AFTER_COMMIT)에만 발동해, 롤백된 이벤트가 발행되는 것을 막는다.
 * id 로 최신 상태를 다시 읽어(payload 확정 보장) 건별로 Kafka 즉시 발행한다.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class OutboxCommitListener {

    private final OutBoxRepository outBoxRepository;
    private final OutboxKafkaPublisher publisher;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOutboxRecorded(OutboxRecorded event) {
        List<Outbox> rows = outBoxRepository.findAllById(event.ids());
        for (Outbox o : rows) {
            publisher.publishAfterCommit(o);
        }
    }
}
