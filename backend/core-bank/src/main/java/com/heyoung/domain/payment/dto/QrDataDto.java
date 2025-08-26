package com.heyoung.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QrDataDto {
    private Long userId;
    private String accountNumber;
}
