package com.heyoung.domain.recommendation.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heyoung.domain.recommendation.dto.request.SaveUserCategoryRequest;
import com.heyoung.domain.recommendation.dto.request.SaveUserHourHistRequest;
import com.heyoung.domain.recommendation.dto.response.FailedResponseDto;
import com.heyoung.domain.recommendation.dto.response.SaveResponse;
import com.heyoung.domain.recommendation.service.RecommendationCommandService;
import com.heyoung.global.exception.BaseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * core-bank 가 Outbox 를 Kafka 로 발행한 이벤트를 소비하여 추천 데이터에 반영하는 리스너.
 *
 * <p>토픽은 OutboxType 별로 분리되어 있으며, 메시지 payload(String JSON)를 각 타입의 DTO 로
 * 역직렬화한 뒤 기존 {@link RecommendationCommandService} 에 위임한다. 멱등성은 서비스 계층의
 * {@code event_consume_log.outbox_id} UNIQUE 로 이미 보장되므로 여기서 중복 처리를 다루지 않는다.
 *
 * <p>처리 실패 시 예외를 전파하여 오프셋 커밋을 막고 레코드를 재소비하도록 한다(at-least-once).
 * 재시도 횟수 제한은 {@code KafkaConsumerConfig} 의 {@code DefaultErrorHandler} 가 담당한다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RecommendationKafkaListener {

    public static final String TOPIC_TRANSACTION_COMPLETED = "command.corebank.transaction-completed.v1";
    public static final String TOPIC_PAYMENT_METHOD_LINKED = "command.corebank.payment-method-linked.v1";

    private final RecommendationCommandService recommendationCommandService;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = TOPIC_TRANSACTION_COMPLETED,
            containerFactory = "recommendationKafkaListenerContainerFactory"
    )
    public void consumeUserCategory(String message) {
        SaveUserCategoryRequest request = deserialize(message, SaveUserCategoryRequest.class);
        BaseResponse<SaveResponse> response = recommendationCommandService.receiveUserCategory(List.of(request));
        verifyProcessed(response);
    }

    @KafkaListener(
            topics = TOPIC_PAYMENT_METHOD_LINKED,
            containerFactory = "recommendationKafkaListenerContainerFactory"
    )
    public void consumeUserHourHist(String message) {
        SaveUserHourHistRequest request = deserialize(message, SaveUserHourHistRequest.class);
        BaseResponse<SaveResponse> response = recommendationCommandService.receiveUserHourHist(List.of(request));
        verifyProcessed(response);
    }

    /**
     * 서비스는 아이템별 예외를 잡아 {@code failed} 목록에 담고 예외를 던지지 않는다
     * (실패 시 {@link BaseResponse#getIsSuccess()} == false). 이 경우 리스너가 예외를 전파해야
     * 오프셋 커밋을 막고 재소비를 유도할 수 있다. 소비자는 멱등(outbox_id UNIQUE)하므로 재전달은 안전하다.
     */
    private void verifyProcessed(BaseResponse<SaveResponse> response) {
        if (Boolean.FALSE.equals(response.getIsSuccess())) {
            List<FailedResponseDto> failed =
                    response.getResult() == null ? List.of() : response.getResult().failed();
            log.error("[Kafka] 처리 실패 감지, 오프셋 커밋을 막고 재소비 유도. failed={}", failed);
            throw new IllegalStateException("Kafka 메시지 처리 실패: " + failed);
        }
    }

    private <T> T deserialize(String message, Class<T> type) {
        try {
            return objectMapper.readValue(message, type);
        } catch (Exception e) {
            // 역직렬화 실패는 예외를 전파해 재시도 대상이 되게 한다(에러 핸들러가 재시도 제한).
            log.error("[Kafka] 메시지 역직렬화 실패. type={}, message={}", type.getSimpleName(), message, e);
            throw new IllegalStateException("Kafka 메시지 역직렬화 실패: " + type.getSimpleName(), e);
        }
    }
}
