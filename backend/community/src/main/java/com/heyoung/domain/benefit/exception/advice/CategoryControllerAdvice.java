package com.heyoung.domain.benefit.exception.advice;

import com.heyoung.global.exception.GeneralException;
import com.heyoung.global.exception.ResponseCode;

public class CategoryControllerAdvice extends GeneralException {
    public CategoryControllerAdvice(ResponseCode responseCode) {
        super(responseCode);
    }
}
