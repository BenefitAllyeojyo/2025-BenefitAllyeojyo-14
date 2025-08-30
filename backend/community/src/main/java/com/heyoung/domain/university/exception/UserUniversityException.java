package com.heyoung.domain.university.exception;

import com.heyoung.global.exception.GeneralException;
import com.heyoung.global.exception.ResponseCode;

public class UserUniversityException extends GeneralException {
    public UserUniversityException(ResponseCode errorCode) {
        super(errorCode);
    }
}
