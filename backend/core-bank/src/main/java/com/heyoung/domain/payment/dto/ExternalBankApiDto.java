package com.heyoung.domain.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * 외부 은행 API와의 통신을 위한 DTO들을 모아놓은 클래스
 * 요청 및 응답 JSON 구조를 객체로 매핑하는 역할
 */
public class ExternalBankApiDto {

    /**
     * API 요청/응답에 공통으로 포함되는 헤더 정보
     */
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Header {
        // --- 요청(Request) 시 보내는 정보 ---
        @JsonProperty("apiName")
        private String apiName;

        @JsonProperty("transmissionDate")
        private String transmissionDate;

        @JsonProperty("transmissionTime")
        private String transmissionTime;

        @JsonProperty("institutionCode")
        private String institutionCode;

        @JsonProperty("fintechAppNo")
        private String fintechAppNo;

        @JsonProperty("apiServiceCode")
        private String apiServiceCode;

        @JsonProperty("institutionTransactionUniqueNo")
        private String institutionTransactionUniqueNo;

        @JsonProperty("apiKey")
        private String apiKey;

        @JsonProperty("userKey")
        private String userKey;

        // --- 응답(Response) 시 받는 정보 ---
        @JsonProperty("responseCode")
        private String responseCode;

        @JsonProperty("responseMessage")
        private String responseMessage;
    }

    // 1. 잔액 조회 (inquireDepositAccountBalance)

    /**
     * 잔액 조회 요청 DTO
     */
    @Getter
    @AllArgsConstructor
    public static class InquireRequest {
        @JsonProperty("Header")
        private Header Header;

        @JsonProperty("accountNo")
        private String accountNo;

    }

    /**
     * 잔액 조회 응답 DTO
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class InquireResponse {
        @JsonProperty("Header")
        private Header Header;

        @JsonProperty("REC")
        private InquireRec rec;
    }

    /**
     * 잔액 조회 응답의 REC 필드 내부 객체
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class InquireRec {
        @JsonProperty("accountNo")
        private String accountNo;

        @JsonProperty("accountBalance")
        private BigDecimal accountBalance;
    }


    // 2. 계좌 출금 (updateDemandDepositAccountWithdrawal)

    /**
     * 계좌 출금 요청 DTO
     */
    @Getter
    @AllArgsConstructor
    public static class WithdrawRequest {
        @JsonProperty("Header")
        private Header Header;

        @JsonProperty("accountNo")
        private String accountNo;

        @JsonProperty("transactionBalance")
        private BigDecimal transactionBalance;

        @JsonProperty("transactionSummary")
        private String transactionSummary;
    }

    /**
     * 계좌 출금 응답 DTO
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class WithdrawResponse {
        @JsonProperty("Header")
        private Header Header;

        @JsonProperty("REC")
        private WithdrawRec rec;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class WithdrawRec {
        @JsonProperty("transactionUniqueNo")
        private String transactionUniqueNo;

        @JsonProperty("transactionDate")
        private String transactionDate;
    }

    // 3. 계좌 거래 내역 조회
    /**
     * 거래 내역 조회 요청 DTO
     */
    @Getter
    @AllArgsConstructor
    public static class InquireTransactionHistoryRequest {
        @JsonProperty("Header")
        private Header Header;

        @JsonProperty("accountNo")
        private String accountNo;

        @JsonProperty("startDate")
        private String startDate; // YYYYMMDD

        @JsonProperty("endDate")
        private String endDate; // YYYYMMDD

        @JsonProperty("transactionType")
        private String transactionType; // A: 전체, M: 입금, D: 출금

        @JsonProperty("orderByType")
        private String orderByType; // ASC: 오름차순(이전거래), DESC: 내림차순(최근거래)
    }

    /**
     * 거래 내역 조회 응답 DTO
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class InquireTransactionHistoryResponse {
        @JsonProperty("Header")
        private Header Header;

        @JsonProperty("REC")
        private HistoryRec rec;
    }

    /**
     * 거래 내역 조회 응답의 REC 필드 내부 객체
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class HistoryRec {
        @JsonProperty("totalCount")
        private String totalCount;

        @JsonProperty("list")
        private List<TransactionHistory> list;
    }

    /**
     * 개별 거래 내역 정보
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class TransactionHistory {
        @JsonProperty("transactionUniqueNo")
        private Long transactionUniqueNo;

        @JsonProperty("transactionDate")
        private String transactionDate;

        @JsonProperty("transactionTime")
        private String transactionTime;

        @JsonProperty("transactionType")
        private String transactionType;

        @JsonProperty("transactionTypeName")
        private String transactionTypeName;

        @JsonProperty("transactionAccountNo")
        private String transactionAccountNo;

        @JsonProperty("transactionBalance")
        private Long transactionBalance;

        @JsonProperty("transactionSummary")
        private String transactionSummary;

        @JsonProperty("transactionAfterBalance")
        private Long transactionAfterBalance;

        @JsonProperty("transactionMemo")
        private String transactionMemo;
    }
}
