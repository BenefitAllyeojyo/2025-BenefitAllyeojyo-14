package com.heyoung.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.Arrays;
import java.util.Optional;
import java.util.function.Predicate;

@Getter
@RequiredArgsConstructor
public enum ResponseCode {
    // 정상 code
    OK(HttpStatus.OK,"2000", "Ok"),

    // Common Error
    _INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON000", "서버 에러, 관리자에게 문의 바랍니다."),
    _BAD_REQUEST(HttpStatus.BAD_REQUEST,"COMMON001","잘못된 요청입니다."),
    _UNAUTHORIZED(HttpStatus.UNAUTHORIZED,"COMMON002","권한이 잘못되었습니다"),
    _METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "COMMON003", "지원하지 않는 Http Method 입니다."),
    _FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON004", "금지된 요청입니다."),

    // Category Error
    CATEGORY_NOT_FOUND(HttpStatus.BAD_REQUEST, "CATEGORY001", "해당 카테고리 데이터가 존재하지 않습니다."),

    // Hour Error
    HOUR_OUT_OF_RANGE(HttpStatus.BAD_REQUEST, "HOUR001", "시간대는 00 ~ 23 입니다."),

    // Payment Error
    PAYMENT_INSUFFICIENT_BALANCE(HttpStatus.BAD_REQUEST, "PAYMENT001", "계좌 잔액이 부족합니다."),
    PAYMENT_EXTERNAL_API_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "PAYMENT002", "외부 결제 시스템 연동 중 오류가 발생했습니다."),

    // JsonError
    JSON_CREATE_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "JSON001", "JSON 파일 생성에 실패했습니다."),

    // WebHook Error
    PATH_NOT_FOUND(HttpStatus.NOT_FOUND, "WEBHOOK001", "해당 키의 PATH 가 존재하지 않습니다."),

    // Dispatcher Error
    INVALID_PAYLOAD(HttpStatus.BAD_REQUEST, "DISPATCHER001", "지원하지 않는 PAYLOAD 입니다."),
    NULL_RESPONSE(HttpStatus.INTERNAL_SERVER_ERROR, "DISPATCHER002", "응답이 존재하지 않습니다."),

    // Outbox → Kafka Error
    UNKNOWN_OUTBOX_TYPE(HttpStatus.INTERNAL_SERVER_ERROR, "OUTBOX001", "알 수 없는 OutboxType 입니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    public String getMessage(Throwable e) {
        return this.getMessage(this.getMessage() + " - " + e.getMessage());
        // 결과 예시 - "Validation error - Reason why it isn't valid"
    }

    public String getMessage(String message) {
        return Optional.ofNullable(message)
                .filter(Predicate.not(String::isBlank))
                .orElse(this.getMessage());
    }

    public static ResponseCode valueOf(HttpStatus httpStatus) {
        if(httpStatus == null) {
            throw new GeneralException("HttpStatus is null.");
        }

        return Arrays.stream(values())
                .filter(errorCode -> errorCode.getHttpStatus() == httpStatus)
                .findFirst()
                .orElseGet(() -> {
                    if(httpStatus.is4xxClientError()) {
                        return ResponseCode._BAD_REQUEST;
                    } else if (httpStatus.is5xxServerError()) {
                        return ResponseCode._INTERNAL_SERVER_ERROR;
                    } else {
                        return ResponseCode.OK;
                    }
                });
    }
}
