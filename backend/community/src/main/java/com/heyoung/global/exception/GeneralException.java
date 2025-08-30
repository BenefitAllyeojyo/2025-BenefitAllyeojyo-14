package com.heyoung.global.exception;

import lombok.Getter;

@Getter
public class GeneralException extends RuntimeException {
    private final ResponseCode errorCode;

    public GeneralException() {
        super(ResponseCode._INTERNAL_SERVER_ERROR.getMessage());
        this.errorCode = ResponseCode._INTERNAL_SERVER_ERROR;
    }

    public GeneralException(String message) {
        super(ResponseCode._INTERNAL_SERVER_ERROR.getMessage(message));
        this.errorCode = ResponseCode._INTERNAL_SERVER_ERROR;
    }

    public GeneralException(String message, Throwable cause) {
        super(ResponseCode._INTERNAL_SERVER_ERROR.getMessage(message), cause);
        this.errorCode = ResponseCode._INTERNAL_SERVER_ERROR;
    }

    public GeneralException(Throwable cause) {
        super(ResponseCode._INTERNAL_SERVER_ERROR.getMessage(cause));
        this.errorCode = ResponseCode._INTERNAL_SERVER_ERROR;
    }

    public GeneralException(ResponseCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public GeneralException(ResponseCode errorCode, String message) {
        super(errorCode.getMessage(message));
        this.errorCode = errorCode;
    }

    public GeneralException(ResponseCode errorCode, String message, Throwable cause) {
        super(errorCode.getMessage(message), cause);
        this.errorCode = errorCode;
    }

    public GeneralException(ResponseCode errorCode, Throwable cause) {
        super(errorCode.getMessage(cause), cause);
        this.errorCode = errorCode;
    }
}
