package com.heyoung.domain.outbox.publisher;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heyoung.domain.outbox.entity.Outbox;
import com.heyoung.domain.outbox.enums.DeliveryErrorType;
import com.heyoung.domain.outbox.exception.advice.OutboxControllerAdvice;
import com.heyoung.domain.outbox.service.OutboxStateService;
import com.heyoung.global.enums.OutboxType;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OutboxKafkaPublisherTest {

    @SuppressWarnings("unchecked")
    private final KafkaTemplate<String, String> kafkaTemplate = mock(KafkaTemplate.class);
    private final OutboxStateService stateService = mock(OutboxStateService.class);
    private final ObjectMapper om = new ObjectMapper();

    private OutboxKafkaPublisher publisher;

    @BeforeEach
    void setUp() {
        // 콜백 executor 는 same-thread(Runnable::run)로 주입해 whenCompleteAsync 를 동기 실행 → 검증 결정적.
        publisher = new OutboxKafkaPublisher(kafkaTemplate, stateService, om, Runnable::run);
    }

    private Outbox transactionOutbox() {
        return Outbox.builder()
                .id(11L)
                .type(OutboxType.TRANSACTION_COMPLETED)
                .payload("{\"outboxId\":11,\"userId\":42,\"categoryId\":7,\"transactionDateTime\":\"2026-07-28T00:00:00Z\"}")
                .uniqKey("uniq-11")
                .build();
    }

    private Outbox paymentOutbox() {
        return Outbox.builder()
                .id(22L)
                .type(OutboxType.PAYMENT_METHOD_LINKED)
                .payload("{\"outboxId\":22,\"userId\":99,\"transactionTime\":\"2026-07-28T00:00:00Z\"}")
                .uniqKey("uniq-22")
                .build();
    }

    private CompletableFuture<SendResult<String, String>> completed() {
        return CompletableFuture.completedFuture(null);
    }

    private CompletableFuture<SendResult<String, String>> failed() {
        CompletableFuture<SendResult<String, String>> f = new CompletableFuture<>();
        f.completeExceptionally(new RuntimeException("broker down"));
        return f;
    }

    @SuppressWarnings("unchecked")
    private ProducerRecord<String, String> captureRecord() {
        ArgumentCaptor<ProducerRecord<String, String>> captor = ArgumentCaptor.forClass(ProducerRecord.class);
        verify(kafkaTemplate).send(captor.capture());
        return captor.getValue();
    }

    @Test
    @DisplayName("topicFor: OutboxType 별로 올바른 토픽을 반환한다")
    void topicFor_mapsEachType() {
        assertThat(publisher.topicFor(OutboxType.TRANSACTION_COMPLETED))
                .isEqualTo(OutboxKafkaPublisher.TOPIC_TRANSACTION_COMPLETED);
        assertThat(publisher.topicFor(OutboxType.PAYMENT_METHOD_LINKED))
                .isEqualTo(OutboxKafkaPublisher.TOPIC_PAYMENT_METHOD_LINKED);
    }

    @Test
    @DisplayName("send: TRANSACTION_COMPLETED → 토픽/키(userId)/값(payload 원문)/헤더가 계약대로 구성된다")
    void send_buildsContractForTransaction() {
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(completed());
        Outbox o = transactionOutbox();

        publisher.send(o);

        ProducerRecord<String, String> record = captureRecord();
        assertThat(record.topic()).isEqualTo(OutboxKafkaPublisher.TOPIC_TRANSACTION_COMPLETED);
        assertThat(record.key()).isEqualTo("42");                 // payload 의 userId
        assertThat(record.value()).isEqualTo(o.getPayload());     // payload 원문 VERBATIM
        assertThat(header(record, OutboxKafkaPublisher.HEADER_OUTBOX_ID)).isEqualTo("11");
        assertThat(header(record, OutboxKafkaPublisher.HEADER_OUTBOX_TYPE)).isEqualTo("TRANSACTION_COMPLETED");
        assertThat(header(record, OutboxKafkaPublisher.HEADER_EVENT_ID)).isEqualTo("uniq-11");
    }

    @Test
    @DisplayName("send: PAYMENT_METHOD_LINKED → 토픽/키/값(원문)/헤더 3종이 계약대로 구성된다")
    void send_buildsContractForPayment() {
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(completed());
        Outbox o = paymentOutbox();

        publisher.send(o);

        ProducerRecord<String, String> record = captureRecord();
        assertThat(record.topic()).isEqualTo(OutboxKafkaPublisher.TOPIC_PAYMENT_METHOD_LINKED);
        assertThat(record.key()).isEqualTo("99");
        assertThat(record.value()).isEqualTo(o.getPayload());     // payload 원문 VERBATIM
        assertThat(header(record, OutboxKafkaPublisher.HEADER_OUTBOX_ID)).isEqualTo("22");
        assertThat(header(record, OutboxKafkaPublisher.HEADER_OUTBOX_TYPE)).isEqualTo("PAYMENT_METHOD_LINKED");
        assertThat(header(record, OutboxKafkaPublisher.HEADER_EVENT_ID)).isEqualTo("uniq-22");
    }

    @Test
    @DisplayName("publishAfterCommit: 성공 시에만 markSent 를 호출한다")
    void publishAfterCommit_marksSentOnSuccess() {
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(completed());

        publisher.publishAfterCommit(transactionOutbox());

        verify(stateService, times(1)).markSent(11L);
        verify(stateService, never()).markFailed(any(), any());
    }

    @Test
    @DisplayName("publishAfterCommit: 실패 시 markSent 를 호출하지 않는다(폴링에 위임)")
    void publishAfterCommit_doesNothingOnFailure() {
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(failed());

        publisher.publishAfterCommit(transactionOutbox());

        verify(stateService, never()).markSent(any());
        verify(stateService, never()).markFailed(any(), any());
    }

    @Test
    @DisplayName("publishAndConfirm: 성공 시 markSent 후 true 를 반환한다")
    void publishAndConfirm_marksSentOnSuccess() {
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(completed());

        boolean result = publisher.publishAndConfirm(transactionOutbox());

        assertThat(result).isTrue();
        verify(stateService, times(1)).markSent(11L);
    }

    @Test
    @DisplayName("publishAndConfirm: 실패 시 markFailed 후 false 를 반환한다")
    void publishAndConfirm_marksFailedOnFailure() {
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(failed());

        boolean result = publisher.publishAndConfirm(transactionOutbox());

        assertThat(result).isFalse();
        verify(stateService, times(1)).markFailed(11L, DeliveryErrorType.OTHER_ERROR);
        verify(stateService, never()).markSent(any());
    }

    @Test
    @DisplayName("topicFor(null): UNKNOWN_OUTBOX_TYPE 예외를 던진다")
    void topicFor_null_throwsUnknownType() {
        assertThatThrownBy(() -> publisher.topicFor(null))
                .isInstanceOf(OutboxControllerAdvice.class);
    }

    @Test
    @DisplayName("send: payload 에 userId 가 없으면 키는 null 이다(정상 발행, 순서 보장 없음)")
    void send_missingUserId_keyIsNull() {
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(completed());
        Outbox o = Outbox.builder()
                .id(33L)
                .type(OutboxType.TRANSACTION_COMPLETED)
                .payload("{\"outboxId\":33,\"categoryId\":7}")   // userId 누락
                .uniqKey("uniq-33")
                .build();

        publisher.send(o);

        ProducerRecord<String, String> record = captureRecord();
        assertThat(record.key()).isNull();
    }

    @Test
    @DisplayName("publishAndConfirm: 파싱 불가 payload → markFailed(INVALID_PAYLOAD) 후 false")
    void publishAndConfirm_malformedPayload_marksFailedInvalidPayload() {
        Outbox o = Outbox.builder()
                .id(44L)
                .type(OutboxType.TRANSACTION_COMPLETED)
                .payload("{ not-a-valid-json ")
                .uniqKey("uniq-44")
                .build();

        boolean result = publisher.publishAndConfirm(o);

        assertThat(result).isFalse();
        verify(stateService, times(1)).markFailed(44L, DeliveryErrorType.INVALID_PAYLOAD);
        verify(stateService, never()).markSent(any());
    }

    @Test
    @DisplayName("publishAndConfirm: 확정 대기 중 TimeoutException → markFailed(TIMEOUT) 후 false")
    void publishAndConfirm_timeout_marksFailedTimeout() {
        // get(timeout, unit) 이 TimeoutException 을 던지도록 하는 future (브로커 불필요, 즉시 반환)
        CompletableFuture<SendResult<String, String>> timeoutFuture =
                new CompletableFuture<SendResult<String, String>>() {
                    @Override
                    public SendResult<String, String> get(long timeout, TimeUnit unit) throws TimeoutException {
                        throw new TimeoutException("simulated confirm timeout");
                    }
                };
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(timeoutFuture);

        boolean result = publisher.publishAndConfirm(transactionOutbox());

        assertThat(result).isFalse();
        verify(stateService, times(1)).markFailed(11L, DeliveryErrorType.TIMEOUT);
        verify(stateService, never()).markSent(any());
    }

    private String header(ProducerRecord<String, String> record, String key) {
        var h = record.headers().lastHeader(key);
        return h == null ? null : new String(h.value(), StandardCharsets.UTF_8);
    }
}
