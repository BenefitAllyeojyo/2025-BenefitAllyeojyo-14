package com.heyoung.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserTotalSavingsDto {
    private Long userId;
    private BigDecimal totalSavedAmount;
}
