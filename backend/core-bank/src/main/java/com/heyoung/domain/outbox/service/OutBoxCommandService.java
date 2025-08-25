package com.heyoung.domain.outbox.service;

import com.heyoung.domain.outbox.dto.response.TransactionResponseDto;
import com.heyoung.domain.payment.dto.response.TransactionListResponse;

import java.util.List;

public interface OutBoxCommandService {
    void saveTransactionOutBox(TransactionResponseDto transactionResponseDto);
    void saveAccountOutBox(List<TransactionListResponse> list);
}
