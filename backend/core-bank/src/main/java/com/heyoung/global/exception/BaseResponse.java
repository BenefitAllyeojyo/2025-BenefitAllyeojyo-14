package com.heyoung.global.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

@Getter
@JsonPropertyOrder({"isSuccess", "code", "message", "result"})
public class BaseResponse<T> {
    @JsonProperty("isSuccess")
    private final Boolean isSuccess;
    private final String code;
    private final String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T result;

    public static <T> BaseResponse<T> onSuccess(T data, ResponseCode code) {
        return new BaseResponse<>(true, code.getCode(), code.getMessage(), data);
    }

    public static <T> BaseResponse<T> onFailure(T errors, ResponseCode code) {
        return new BaseResponse<>(false, code.getCode(), code.getMessage(), errors);
    }

    @Builder
    public BaseResponse(Boolean isSuccess, String code, String message, T result) {
        this.isSuccess = isSuccess;
        this.code = code;
        this.message = message;
        this.result = result;
    }

    @Getter
    public static class FieldError {
        private String field;
        private String message;

        @Builder
        public FieldError(String field, String message) {
            this.field = field;
            this.message = message;
        }
    }
}
