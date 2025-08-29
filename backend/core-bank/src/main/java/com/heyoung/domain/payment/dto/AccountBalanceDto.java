package com.heyoung.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class AccountBalanceDto {
    private String accountNumber;
    private BigDecimal balance;
}