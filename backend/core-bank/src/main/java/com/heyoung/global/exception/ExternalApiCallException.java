package com.heyoung.global.exception;

public class ExternalApiCallException extends GeneralException{
    public ExternalApiCallException() {
        super(ResponseCode.PAYMENT_EXTERNAL_API_ERROR);
    }

    public ExternalApiCallException(Throwable cause) {
        super(ResponseCode.PAYMENT_EXTERNAL_API_ERROR, cause);
    }

}
