package com.heyoung.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QrDataDto {
    private String qrToken; // 암호화된 JWT 토큰
    private Long userId;
    private String accountNumber;
}
