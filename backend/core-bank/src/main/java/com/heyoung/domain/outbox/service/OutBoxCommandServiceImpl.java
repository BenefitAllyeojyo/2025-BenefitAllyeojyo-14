package com.heyoung.domain.outbox.service;

import com.heyoung.domain.outbox.converter.OutBoxConverter;
import com.heyoung.domain.outbox.dto.response.TransactionResponseDto;
import com.heyoung.domain.outbox.entity.Outbox;
import com.heyoung.domain.outbox.event.OutboxRecorded;
import com.heyoung.domain.outbox.repository.OutBoxRepository;
import com.heyoung.domain.payment.dto.response.TransactionListResponse;
import com.heyoung.global.enums.OutboxType;
import com.heyoung.global.utils.UuidUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.IntStream;

@Service
@AllArgsConstructor
public class OutBoxCommandServiceImpl implements OutBoxCommandService {

    private final OutBoxRepository outBoxRepository;
    private final OutBoxConverter outBoxConverter;
    private final UuidUtil uuidUtil;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public void saveTransactionOutBox(TransactionResponseDto transactionResponseDto) {

        Outbox saved = outBoxRepository.save(
                Outbox.builder()
                .payload("{\"placeholder\": true}")
                .occurredAt(transactionResponseDto.transactionDateTime())
                .uniqKey(uuidUtil.createUuid())
                .type(OutboxType.TRANSACTION_COMPLETED).build()
        );

        saved.setPayload(outBoxConverter.toPayloadJson(saved.getId(), transactionResponseDto));

        // 커밋 직후 fast-path 발행을 트리거 (AFTER_COMMIT 리스너가 수신). Kafka 직접 발행 금지.
        eventPublisher.publishEvent(new OutboxRecorded(List.of(saved.getId())));
    }

    @Override
    @Transactional
    public void saveAccountOutBox(List<TransactionListResponse> list) {

        List<Outbox> saved = outBoxRepository.saveAll(outBoxConverter.accountToOutbox(list));
        List<String> jsonList = outBoxConverter.accountToPayloadJson(list, saved);

        IntStream.range(0, saved.size())
                .forEach(i -> saved.get(i).setPayload(jsonList.get(i)));

        List<Long> ids = saved.stream().map(Outbox::getId).toList();
        eventPublisher.publishEvent(new OutboxRecorded(ids));
    }
}
