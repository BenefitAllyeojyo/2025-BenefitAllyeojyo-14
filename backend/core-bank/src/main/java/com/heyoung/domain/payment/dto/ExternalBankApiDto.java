package com.heyoung.domain.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

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
}
