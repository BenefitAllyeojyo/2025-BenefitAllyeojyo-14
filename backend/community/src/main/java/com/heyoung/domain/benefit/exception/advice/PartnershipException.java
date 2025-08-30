package com.heyoung.domain.benefit.exception.advice;

import com.heyoung.global.exception.GeneralException;
import com.heyoung.global.exception.ResponseCode;

public class PartnershipException extends GeneralException {
    public PartnershipException(ResponseCode errorCode) {
        super(errorCode);
    }
}
