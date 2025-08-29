package com.heyoung.global.infra.fcm.exception;

import com.heyoung.global.exception.GeneralException;
import com.heyoung.global.exception.ResponseCode;

public class FcmException extends GeneralException {
    public FcmException(ResponseCode errorCode) {
        super(errorCode);
    }
}
