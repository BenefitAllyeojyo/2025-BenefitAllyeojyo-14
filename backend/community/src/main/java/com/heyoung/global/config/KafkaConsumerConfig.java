package com.heyoung.global.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

/**
 * Outbox → Kafka 승격의 소비자 측 설정.
 *
 * <p>키/값 모두 String 으로 역직렬화하고(payload 는 리스너에서 ObjectMapper 로 DTO 변환),
 * 오프셋은 수동 커밋 전략({@code enable-auto-commit=false})을 사용한다. 처리 성공 후에만
 * 오프셋이 커밋되도록 하여 at-least-once 전달을 보장하며, 중복은 소비자 멱등성
 * ({@code event_consume_log.outbox_id} UNIQUE)으로 무해화한다.
 */
@Slf4j
@EnableKafka
@Configuration
public class KafkaConsumerConfig {

    private final String bootstrapServers;
    private final String groupId;
    private final String autoOffsetReset;

    public KafkaConsumerConfig(
            @Value("${spring.kafka.bootstrap-servers:localhost:9092}") String bootstrapServers,
            @Value("${spring.kafka.consumer.group-id:community-recommendation}") String groupId,
            @Value("${spring.kafka.consumer.auto-offset-reset:earliest}") String autoOffsetReset
    ) {
        this.bootstrapServers = bootstrapServers;
        this.groupId = groupId;
        this.autoOffsetReset = autoOffsetReset;
    }

    @Bean
    public ConsumerFactory<String, String> recommendationConsumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, autoOffsetReset);
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> recommendationKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(recommendationConsumerFactory());
        factory.setCommonErrorHandler(recommendationErrorHandler());
        return factory;
    }

    /**
     * 유한 재시도 후 실패를 로깅만 하고 넘어가는 에러 핸들러.
     *
     * <p>poison message 가 파티션을 영구히 막지 않도록 재시도 횟수를 제한한다(DLQ 는 범위 밖).
     * 재시도 소진 시 오프셋은 커밋되어 다음 레코드로 진행한다. 처리 로직 자체가 멱등이므로,
     * 소진 전 재소비는 안전하다.
     */
    @Bean
    public DefaultErrorHandler recommendationErrorHandler() {
        // 1초 간격, 최대 3회 재시도(총 4회 시도) 후 복구
        FixedBackOff backOff = new FixedBackOff(1000L, 3L);
        DefaultErrorHandler errorHandler = new DefaultErrorHandler(
                (record, exception) -> log.error(
                        "[Kafka] 재시도 소진, 레코드 스킵. topic={}, partition={}, offset={}, key={}",
                        record.topic(), record.partition(), record.offset(), record.key(), exception),
                backOff);
        return errorHandler;
    }
}
