package com.heyoung.domain.payment.service;

import com.heyoung.domain.payment.dto.QrDataDto;
import com.heyoung.domain.payment.entity.Account;
import com.heyoung.domain.payment.repository.AccountRepository;
import com.heyoung.domain.user.entity.User;
import com.heyoung.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class TransactionService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    // 사용자 qr 데이터
    @Transactional(readOnly = true)
    public QrDataDto generateQrData(Long memberId) {
        User user = userRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계좌"));

        return new QrDataDto(user.getId(), account.getAccountNumber());
    }

}
