package com.heyoung.domain.payment.service;

import com.heyoung.domain.payment.dto.AccountBalanceDto;
import com.heyoung.domain.payment.entity.Account;
import com.heyoung.domain.payment.repository.AccountRepository;
import com.heyoung.domain.user.entity.User;
import com.heyoung.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final ExternalBankApiService externalBankApiService;

    @Transactional(readOnly = true)
    public AccountBalanceDto getAccountBalance(Long memberId) {
        User user = userRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계좌"));

        BigDecimal currentBalance = externalBankApiService.inquireBalance(account.getAccountNumber(), user.getId());

        return new AccountBalanceDto(account.getAccountNumber(), currentBalance);
    }
}