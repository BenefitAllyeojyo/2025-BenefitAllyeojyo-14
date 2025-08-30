package com.heyoung.domain.outbox.exception.advice;

import com.heyoung.global.exception.GeneralException;
import com.heyoung.global.exception.ResponseCode;

public class OutboxControllerAdvice extends GeneralException {
    public OutboxControllerAdvice(ResponseCode responseCode) {
        super(responseCode);
    }
}
