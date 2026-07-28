package com.heyoung.domain.outbox.service;

import com.heyoung.domain.outbox.enums.DeliveryErrorType;
import com.heyoung.domain.outbox.repository.OutBoxRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ThreadLocalRandom;

/**
 * outbox row 의 전송 상태(sent_at / attempt / next_retry_at / last_error) 변경을
 * 독립된 트랜잭션 빈으로 분리한다.
 * fast-path 퍼블리셔와 폴링 디스패처가 모두 이 빈을 Spring 프록시로 호출하므로,
 * 기존 디스패처의 self-invocation @Transactional 리스크가 해소된다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxStateService {

    private final OutBoxRepository outBoxRepository;

    // 재시도 컷오프. 디스패처의 픽업 조건(MAX_ATTEMPT)과 일치시킨다.
    @Value("${outbox.dispatch.max-attempt:5}")
    private int maxAttempt;

    // 지수 백오프(+지터) 파라미터 (기존 디스패처 로직 이관)
    private static final int BACKOFF_BASE_S = 10;
    private static final int BACKOFF_MAX_S = 300;
    private static final double JITTER_RATE = 0.2;

    @Transactional
    public void markSent(Long id) {
        outBoxRepository.findById(id).ifPresent(ob -> {
            ob.setSentAt(Instant.now());
            ob.setLastError(null);
        });
    }

    @Transactional
    public void markFailed(Long id, DeliveryErrorType reason) {
        outBoxRepository.findById(id).ifPresent(ob -> {
            int attempt = (ob.getAttempt() == null ? 0 : ob.getAttempt()) + 1;
            ob.setAttempt(attempt);
            ob.setNextRetryAt(nextRetry(attempt));
            ob.setLastError(reason);
            if (attempt >= maxAttempt) {
                // 재시도 컷오프 도달 → 더 이상 폴링이 픽업하지 않는다. 운영 감지를 위해 에러 로깅.
                log.error("[outbox] stranded after max attempts: id={}, lastError={}", id, reason);
            }
        });
    }

    // 지수 백오프(+지터) 계산
    private Instant nextRetry(int attempt) {
        double base = BACKOFF_BASE_S * Math.pow(2, Math.max(0, attempt - 1));
        int capped = (int) Math.min(base, BACKOFF_MAX_S);
        double jitter = 1 + ((ThreadLocalRandom.current().nextDouble() * 2 - 1) * JITTER_RATE);
        long sec = Math.max(1, Math.round(capped * jitter));
        return Instant.now().plusSeconds(sec);
    }
}
