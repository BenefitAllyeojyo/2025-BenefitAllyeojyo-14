package com.heyoung.domain.recommendation.exception;

import com.heyoung.global.exception.GeneralException;
import com.heyoung.global.exception.ResponseCode;

public class UserCategoryControllerAdvice extends GeneralException {
    public UserCategoryControllerAdvice(ResponseCode responseCode) {
        super(responseCode);
    }
}
