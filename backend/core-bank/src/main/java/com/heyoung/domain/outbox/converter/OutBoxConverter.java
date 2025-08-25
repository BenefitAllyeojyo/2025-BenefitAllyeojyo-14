package com.heyoung.domain.outbox.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.heyoung.domain.outbox.dto.request.SaveUserCategoryRequest;
import com.heyoung.domain.outbox.dto.request.SaveUserHourHistRequest;
import com.heyoung.domain.outbox.dto.response.TransactionResponseDto;
import com.heyoung.domain.outbox.entity.Outbox;
import com.heyoung.domain.outbox.exception.advice.OutboxControllerAdvice;
import com.heyoung.domain.payment.dto.response.TransactionListResponse;
import com.heyoung.global.enums.OutboxType;
import com.heyoung.global.exception.ResponseCode;
import com.heyoung.global.utils.UuidUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OutBoxConverter {

    private final ObjectMapper om; // ← 전역 설정 주입
    private final UuidUtil uuidUtil;

    public String toPayloadJson(Long outboxId, TransactionResponseDto transactionResponseDto) {

        SaveUserCategoryRequest request = new SaveUserCategoryRequest(outboxId, transactionResponseDto.userId(), transactionResponseDto.categoryId(), transactionResponseDto.transactionDateTime());

        String json = null;
        try {
            json = om.writeValueAsString(request);
        } catch (JsonProcessingException e) {
            throw new OutboxControllerAdvice(ResponseCode.JSON_CREATE_FAIL);
        }

        return json;
    }

    public List<Outbox> accountToOutbox(List<TransactionListResponse> list) {
        List<Outbox> res = new ArrayList<>();

        for(TransactionListResponse data : list) {
            res.add(Outbox.builder()
                    .occurredAt(data.getTransactionTime())
                    .payload("{\"placeholder\": true}")
                    .type(OutboxType.PAYMENT_METHOD_LINKED)
                    .uniqKey(uuidUtil.createUuid())
                    .build());
        }

        return res;
    }

    public List<String> accountToPayloadJson(List<TransactionListResponse> list, List<Outbox> outboxList) {
        List<String> res = new ArrayList<>();

        for(int i = 0; i<list.size(); i++) {
            TransactionListResponse data = list.get(i);
            Long outboxId = outboxList.get(i).getId();

            String json = null;
            try {
                json = om.writeValueAsString(
                        new SaveUserHourHistRequest(outboxId, data.getUserId(), data.getTransactionTime())
                );
            } catch (JsonProcessingException e) {
                throw new OutboxControllerAdvice(ResponseCode.JSON_CREATE_FAIL);
            }

            res.add(json);

        }

        return res;
    }
}
