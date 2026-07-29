package com.heyoung.domain.outbox.service;

import com.heyoung.domain.outbox.repository.OutBoxRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 폴링 픽업/리스 전용 트랜잭션 빈.
 *
 * <p>디스패처가 self-invocation 으로 {@code @Transactional} 을 호출하면 프록시가 적용되지 않아
 * 트랜잭션이 걸리지 않는 문제가 있었다. 이를 별도 빈으로 분리해 Cross-bean 호출로 프록시가 실제
 * 적용되게 한다. 픽업(FOR UPDATE SKIP LOCKED)과 리스(next_retry_at 갱신)를 한 짧은 트랜잭션으로
 * 커밋하고 즉시 락을 놓는다. 커밋 이후에는 리스(next_retry_at = now()+leaseSec)가 다른 워커의
 * 재픽업을 막으므로, 행 락을 커밋 시점에 해제해도 안전하다.
 */
@Service
@RequiredArgsConstructor
public class OutboxPickService {

    private final OutBoxRepository outBoxRepository;

    @Transactional
    public List<Long> pickAndLease(int pickLimit, int leaseSec, int maxAttempt) {
        List<Long> ids = outBoxRepository.lockAndPickIds(pickLimit, maxAttempt);
        if (!ids.isEmpty()) {
            outBoxRepository.leaseByIds(ids, leaseSec);
        }
        return ids;
    }
}
