package com.heyoung.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * fast-path 콜백(markSent)을 Kafka Sender 스레드에서 떼어내기 위한 소형 전용 풀.
 *
 * <p>{@code publishAfterCommit} 의 {@code whenCompleteAsync} 가 이 풀에서 DB 상태전이를 실행한다.
 * Sender 스레드를 DB I/O 로 막지 않도록 코어 2 / 최대 4 의 작은 크기로 제한한다.
 */
@Configuration
public class OutboxExecutorConfig {

    @Bean("outboxMarkExecutor")
    public Executor outboxMarkExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setThreadNamePrefix("outbox-mark-");
        executor.initialize();
        return executor;
    }
}
