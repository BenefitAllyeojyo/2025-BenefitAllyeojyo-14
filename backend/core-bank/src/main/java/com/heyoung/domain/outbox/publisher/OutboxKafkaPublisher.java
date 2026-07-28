package com.heyoung.domain.outbox.publisher;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.heyoung.domain.outbox.entity.Outbox;
import com.heyoung.domain.outbox.enums.DeliveryErrorType;
import com.heyoung.domain.outbox.exception.advice.OutboxControllerAdvice;
import com.heyoung.domain.outbox.service.OutboxStateService;
import com.heyoung.global.enums.OutboxType;
import com.heyoung.global.exception.ResponseCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * outbox → Kafka 발행 로직의 단일 진입점.
 * fast-path(커밋 직후)와 폴링 안전망이 모두 이 컴포넌트를 공유해 발행/상태전이를 일원화한다.
 *
 * - 메시지 value = outbox.payload 원문(VERBATIM). 재직렬화/재구성하지 않는다.
 * - 파티션 키 = payload 안의 userId (사용자 단위 순서 보장).
 * - 헤더 = outboxId, outboxType, eventId(uniqKey).
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class OutboxKafkaPublisher {

    public static final String TOPIC_TRANSACTION_COMPLETED = "command.corebank.transaction-completed.v1";
    public static final String TOPIC_PAYMENT_METHOD_LINKED  = "command.corebank.payment-method-linked.v1";

    public static final String HEADER_OUTBOX_ID   = "outboxId";
    public static final String HEADER_OUTBOX_TYPE = "outboxType";
    public static final String HEADER_EVENT_ID    = "eventId";

    private static final long CONFIRM_TIMEOUT_SEC = 3;

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final OutboxStateService outboxStateService;
    private final ObjectMapper om;
    /** fast-path 콜백의 markSent 를 Kafka Sender 스레드 밖에서 실행하기 위한 전용 풀. */
    private final Executor outboxMarkExecutor;

    /** OutboxType → 토픽 매핑. 알 수 없는 타입은 예외(기존 UNKNOWN 처리 계승). */
    public String topicFor(OutboxType type) {
        if (type == null) {
            throw new OutboxControllerAdvice(ResponseCode.UNKNOWN_OUTBOX_TYPE);
        }
        return switch (type) {
            case TRANSACTION_COMPLETED -> TOPIC_TRANSACTION_COMPLETED;
            case PAYMENT_METHOD_LINKED -> TOPIC_PAYMENT_METHOD_LINKED;
        };
    }

    /** ProducerRecord(토픽, 키=userId, 값=payload 원문) + 3개 헤더를 만들어 비동기 발행한다. */
    public CompletableFuture<SendResult<String, String>> send(Outbox o) {
        String topic = topicFor(o.getType());
        String key = extractUserId(o.getPayload());
        ProducerRecord<String, String> record =
                new ProducerRecord<>(topic, null, key, o.getPayload(), headers(o));
        return kafkaTemplate.send(record);
    }

    /**
     * fast-path: 커밋 직후 best-effort 발행.
     * 성공 시에만 markSent, 실패 시에는 아무것도 하지 않는다(sent_at NULL 유지 → 폴링이 재발행).
     */
    public void publishAfterCommit(Outbox o) {
        try {
            send(o).whenCompleteAsync((result, ex) -> {
                if (ex == null) {
                    outboxStateService.markSent(o.getId());
                    log.debug("fast-path published outboxId={} type={}", o.getId(), o.getType());
                } else {
                    log.warn("fast-path publish failed outboxId={}, leaving sent_at NULL for polling", o.getId(), ex);
                }
            }, outboxMarkExecutor);
        } catch (Exception e) {
            // send() 준비 단계(토픽/payload 오류)에서의 동기 예외도 폴링에 위임한다.
            log.warn("fast-path publish skipped outboxId={} due to build error, leaving for polling", o.getId(), e);
        }
    }

    /**
     * 폴링 안전망: 동기 발행 후 결과를 확정한다.
     * 성공 시 markSent, 실패 시 markFailed(백오프). 성공 여부를 boolean 으로 반환.
     */
    public boolean publishAndConfirm(Outbox o) {
        try {
            send(o).get(CONFIRM_TIMEOUT_SEC, TimeUnit.SECONDS);
            outboxStateService.markSent(o.getId());
            return true;
        } catch (Exception e) {
            outboxStateService.markFailed(o.getId(), classifyError(e));
            log.warn("polling publish failed outboxId={}", o.getId(), e);
            return false;
        }
    }

    private List<Header> headers(Outbox o) {
        return List.of(
                new RecordHeader(HEADER_OUTBOX_ID, String.valueOf(o.getId()).getBytes(StandardCharsets.UTF_8)),
                new RecordHeader(HEADER_OUTBOX_TYPE, o.getType().name().getBytes(StandardCharsets.UTF_8)),
                new RecordHeader(HEADER_EVENT_ID, String.valueOf(o.getUniqKey()).getBytes(StandardCharsets.UTF_8))
        );
    }

    private String extractUserId(String payload) {
        try {
            JsonNode node = om.readTree(payload);
            JsonNode userId = node.get("userId");
            return (userId == null || userId.isNull()) ? null : userId.asText();
        } catch (Exception e) {
            throw new OutboxControllerAdvice(ResponseCode.INVALID_PAYLOAD);
        }
    }

    private DeliveryErrorType classifyError(Exception e) {
        if (e instanceof TimeoutException) {
            return DeliveryErrorType.TIMEOUT;
        }
        if (e instanceof OutboxControllerAdvice) {
            return DeliveryErrorType.INVALID_PAYLOAD;
        }
        return DeliveryErrorType.OTHER_ERROR;
    }
}
