package com.heyoung.global.exception;

public class InsufficientBalanceException extends GeneralException{
    public InsufficientBalanceException() {
        super(ResponseCode.PAYMENT_INSUFFICIENT_BALANCE);
    }
}
