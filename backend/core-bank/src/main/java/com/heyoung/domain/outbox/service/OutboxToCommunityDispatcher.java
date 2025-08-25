package com.heyoung.domain.outbox.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heyoung.domain.outbox.client.CommunityWebHookClient;
import com.heyoung.domain.outbox.dto.request.SaveUserCategoryRequest;
import com.heyoung.domain.outbox.dto.request.SaveUserHourHistRequest;
import com.heyoung.domain.outbox.dto.response.SaveResponse;
import com.heyoung.domain.outbox.entity.Outbox;
import com.heyoung.domain.outbox.enums.DeliveryErrorType;
import com.heyoung.domain.outbox.repository.OutBoxRepository;
import com.heyoung.global.enums.OutboxType;
import com.heyoung.global.exception.BaseResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service @Slf4j
@RequiredArgsConstructor
public class OutboxToCommunityDispatcher {

    private final OutBoxRepository outBoxRepository;
    private final CommunityWebHookClient communityWebHookClient;
    private final ObjectMapper om;

    // 운영/해커톤 기본값 (필요하면 yml 로 뺄 수 있음)
    private static final int PICK_LIMIT     = 200; // 한 번에 집을 최대 행 수
    private static final int LEASE_SEC      = 30;   // 다른 워커가 못 집게 막는 임대 시간
    private static final int MAX_ATTEMPT    = 5;    // 재시도 컷오프
    private static final int BATCH_SIZE     = 200;  // community 로 보내는 청크 크기
    private static final int BACKOFF_BASE_S = 10;   // 백오프 시작값(초)
    private static final int BACKOFF_MAX_S  = 300;  // 백오프 최대(초)
    private static final double JITTER_RATE = 0.2;  // ±20% 지터

    @Transactional
    @Scheduled(
            fixedDelayString = "${outbox.dispatch.delay-ms:5000}",
            initialDelayString = "${outbox.dispatch.initial-delay-ms:2000}"
    )
    public void run() {
        try {
            dispatchOnce();
        } catch (Exception e) {
            log.error("Outbox dispatch failed", e);
        }
    }

    // 한 번의 디스패치 사이클
    public int dispatchOnce() {
        // 1) id 픽업 + 리스
        List<Long> ids = pickAndLease();
        if(ids.isEmpty()) return 0;

        // 2) 엔티티 로드(락 없음)
        List<Outbox> rows = outBoxRepository.findAllById(ids);

        // 3) 타입별 그룹핑
        Map<OutboxType, List<Outbox>> byType = rows.stream()
                .collect(Collectors.groupingBy(Outbox::getType));

        int totalAcked = 0;

        // 4) 타입별 처리
        for (var entry : byType.entrySet()) {
            OutboxType type = entry.getKey();
            List<Outbox> group = entry.getValue();

            if(OutboxType.TRANSACTION_COMPLETED.equals(type)) {
                totalAcked += sendCategoryBatches(group);
            } else if(OutboxType.PAYMENT_METHOD_LINKED.equals(type)) {
                totalAcked += sendHourBatches(group);
            } else {
                // 알 수 없는 타입 실패 마킹
                log.warn("알 수 없는 outbox type = {}, size = {}", type, group.size());
                markFailed(group, DeliveryErrorType.UNKNOWN);
            }
        }

        return totalAcked;
    }

    @Transactional
    protected List<Long> pickAndLease() {
        List<Long> ids = outBoxRepository.lockAndPickIds(PICK_LIMIT, MAX_ATTEMPT);
        if(!ids.isEmpty()) {
            outBoxRepository.leaseByIds(ids, LEASE_SEC);
        }
        return ids;
    }

    // TRANSACTION_COMPLETE 묶음을 200개씩 전송
    private int sendCategoryBatches(List<Outbox> set) {
        int acked = 0;
        for(int i = 0; i<set.size(); i+=BATCH_SIZE) {
            List<Outbox> chunk = set.subList(i, Math.min(i + BATCH_SIZE, set.size()));

            // Transaction JSON -> SaveUserCategoryRequest 로 역직렬화.
            List<SaveUserCategoryRequest> items = new ArrayList<>(chunk.size());
            List<Outbox> badTransaction = new ArrayList<>();

            for(Outbox ob : chunk) {
                try {
                    items.add(om.readValue(ob.getPayload(), SaveUserCategoryRequest.class));
                } catch (Exception e) {
                    badTransaction.add(ob);
                }
            }

            // JSON 불량건은 즉시 실패 마킹
            if(!badTransaction.isEmpty()) {
                markFailed(badTransaction, DeliveryErrorType.INVALID_PAYLOAD);
            }

            // 보낼 게 없으면 다음 청크
            List<Outbox> okRows = chunk.stream()
                    .filter(ob -> !badTransaction.contains(ob))
                    .toList();

            if(okRows.isEmpty()) continue;

            try {
                BaseResponse<SaveResponse> response = communityWebHookClient.sendCategoryBatch(items);
                if(response != null && Boolean.TRUE.equals(response.getIsSuccess())) {
                    markSent(okRows);
                    acked += okRows.size();
                } else {
                    DeliveryErrorType reason = (response == null) ? DeliveryErrorType.NONE_RESPONSE : DeliveryErrorType.OTHER_ERROR;
                    markFailed(okRows, reason);
                }
            } catch (Exception e) {
                markFailed(okRows, DeliveryErrorType.OTHER_ERROR);
            }
        }

        return acked;
    }

    // PAYMENT_METHOD_LINKED 묶음을 200개씩 전송
    private int sendHourBatches(List<Outbox> set) {
        int acked = 0;
        for(int i = 0; i<set.size(); i+=BATCH_SIZE) {
            List<Outbox> chunk = set.subList(i, Math.min(i + BATCH_SIZE, set.size()));

            List<SaveUserHourHistRequest> items = new ArrayList<>(chunk.size());
            List<Outbox> badPayload = new ArrayList<>();

            for(Outbox ob : chunk) {
                try {
                    items.add(om.readValue(ob.getPayload(), SaveUserHourHistRequest.class));
                } catch (Exception e) {
                    badPayload.add(ob);
                }
            }

            if(!badPayload.isEmpty()) {
                markFailed(badPayload, DeliveryErrorType.INVALID_PAYLOAD);
            }

            List<Outbox> okRows = chunk.stream()
                    .filter(ob -> !badPayload.contains(ob))
                    .toList();

            if(okRows.isEmpty()) continue;

            try {
                BaseResponse<SaveResponse> response = communityWebHookClient.sendHourBatch(items);

                if(response != null && Boolean.TRUE.equals(response.getIsSuccess())) {
                    markSent(okRows);
                    acked += okRows.size();
                } else {
                    DeliveryErrorType reason = (response == null) ? DeliveryErrorType.NONE_RESPONSE : DeliveryErrorType.OTHER_ERROR;
                    markFailed(okRows, reason);
                }
            } catch (Exception e) {
                markFailed(okRows, DeliveryErrorType.NETWORK);
            }
        }

        return acked;
    }

    /**
     * 상태 반영 함수들.
      */

    // 성공 처리!
    @Transactional
    protected void markSent(List<Outbox> rows) {
        Instant now = Instant.now();
        for(Outbox ob : rows) {
            ob.setSentAt(now);
            ob.setLastError(null);
        }
        outBoxRepository.saveAll(rows);
    }

    // 실패 처리!
    @Transactional
    protected void markFailed(List<Outbox> rows, DeliveryErrorType reason) {
        for(Outbox ob : rows) {
            int a = (ob.getAttempt() == null ? 0 : ob.getAttempt() + 1);
            ob.setAttempt(a);
            ob.setNextRetryAt(nextRetry(a));
            ob.setLastError(reason);
        }
        outBoxRepository.saveAll(rows);
    }

    // 지수 백오프(+지터) 계산
    private Instant nextRetry(int attempt) {
        double base = BACKOFF_BASE_S * Math.pow(2, Math.max(0, attempt-1));
        int capped = (int) Math.min(base, BACKOFF_MAX_S);
        double jitter = 1 + ((ThreadLocalRandom.current().nextDouble() * 2 - 1) * JITTER_RATE);
        long sec = Math.max(1, Math.round(capped * jitter));
        return Instant.now().plusSeconds(sec);
    }
}