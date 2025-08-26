package com.heyoung.domain.payment.service;

import com.heyoung.domain.payment.dto.ExternalBankApiDto;
import com.heyoung.domain.user.repository.UserRepository;
import com.heyoung.global.exception.ExternalApiCallException;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;
import org.slf4j.Logger;

import com.heyoung.domain.user.entity.User;

@Service
public class ExternalBankApiService {
    private static final Logger log = LoggerFactory.getLogger(ExternalBankApiService.class);

    private final RestTemplate restTemplate;

    @Value("${external.bank.api.url.inquire}")
    private String inquireUrl;

    @Value("${external.bank.api.url.withdraw}")
    private String withdrawUrl;

    @Value("${external.bank.api.key}")
    private String apiKey;

    // API 명세에 맞는 날짜/시간 포맷 정의
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HHmmss");
    private static final DateTimeFormatter UNIQUE_ID_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    // API 명세에 필요한 userKey 조회 목적
    private final UserRepository userRepository;

    public ExternalBankApiService(RestTemplate restTemplate, UserRepository userRepository) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
    }

    /**
     * 외부 API를 호출하여 계좌 잔액 조회
     */
    public BigDecimal inquireBalance(String accountNo, Long userId) {
        ExternalBankApiDto.Header header = createHeader("inquireDemandDepositAccountBalance", userId);
        ExternalBankApiDto.InquireRequest request = new ExternalBankApiDto.InquireRequest(header, accountNo);
        HttpEntity<ExternalBankApiDto.InquireRequest> requestEntity = new HttpEntity<>(request, createHttpHeaders());

        try {
            ExternalBankApiDto.InquireResponse response = restTemplate.postForObject(inquireUrl, requestEntity, ExternalBankApiDto.InquireResponse.class);

            if (response == null || !response.getHeader().getResponseCode().equals("H0000") || response.getRec() == null) {
                throw new ExternalApiCallException();
            }
            return response.getRec().getAccountBalance();
        } catch (RestClientException e) {
            log.error("External API call failed during inquireBalance: ", e);
            throw new ExternalApiCallException(e);
        }
    }

    /**
     * 외부 API를 호출하여 계좌에서 금액 출금
     */
    public void withdraw(Long userId, String accountNo, BigDecimal amount, String summary) {
        ExternalBankApiDto.Header header = createHeader("updateDemandDepositAccountWithdrawal", userId);
        ExternalBankApiDto.WithdrawRequest request = new ExternalBankApiDto.WithdrawRequest(header, accountNo, amount, summary);
        HttpEntity<ExternalBankApiDto.WithdrawRequest> requestEntity = new HttpEntity<>(request, createHttpHeaders());

        try {
            ExternalBankApiDto.WithdrawResponse response = restTemplate.postForObject(withdrawUrl, requestEntity, ExternalBankApiDto.WithdrawResponse.class);
            if (response == null || !response.getHeader().getResponseCode().equals("H0000") || response.getRec() == null) {
                throw new ExternalApiCallException();
            }
        } catch (RestClientException e) {
            log.error("External API call failed during withdraw: ", e);
            throw new ExternalApiCallException(e);
        }
    }

    private HttpHeaders createHttpHeaders() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return httpHeaders;
    }

    /**
     * API 요청 시마다 동적인 시간 값과 고유 거래번호 생성
     */
    private ExternalBankApiDto.Header createHeader(String apiName, Long userId) {
        LocalDateTime now = LocalDateTime.now();

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
        String userKey = user.getUserKey();

        // 6자리 난수 생성 (100000 ~ 999999)
        int randomSequence = ThreadLocalRandom.current().nextInt(100000, 1000000);

        // yyyyMMddHHmmss + 6자리 난수 = 20자리 고유번호
        String uniqueId = now.format(UNIQUE_ID_DATE_FORMATTER) + randomSequence;

        return new ExternalBankApiDto.Header(
                apiName,
                now.format(DATE_FORMATTER),   // 전송일자 (yyyyMMdd)
                now.format(TIME_FORMATTER),   // 전송시각 (HHmmss)
                "00100", // 기관코드
                "001", // 핀테크 앱 번호
                apiName, // 서비스 코드
                uniqueId, // 기관 거래 고유번호 (20자리 난수)
                apiKey, // apiKey
                userKey, // userKey
                null, // responseCode
                null  // responseMessage
        );
    }
}
