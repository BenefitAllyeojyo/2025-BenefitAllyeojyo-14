package com.heyoung.domain.notification.exception;

import com.heyoung.global.exception.GeneralException;
import com.heyoung.global.exception.ResponseCode;

public class NotificationException extends GeneralException {
    public NotificationException(ResponseCode errorCode) {
        super(errorCode);
    }
}
