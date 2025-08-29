package com.heyoung.domain.payment.service;

import com.heyoung.domain.outbox.service.OutBoxCommandService;
import com.heyoung.domain.outbox.service.OutBoxCommandService;
import com.heyoung.domain.payment.dto.ExternalBankApiDto;
import com.heyoung.domain.outbox.service.OutBoxCommandService;
import com.heyoung.domain.payment.dto.QrDataDto;
import com.heyoung.domain.payment.dto.QrTokenDto;
import com.heyoung.domain.payment.dto.TransactionRequestDto;
import com.heyoung.domain.payment.dto.TransactionResponseDto;
import com.heyoung.domain.payment.entity.Account;
import com.heyoung.domain.payment.entity.Category;
import com.heyoung.domain.payment.entity.Transaction;
import com.heyoung.domain.payment.entity.UserBenefitHistory;
import com.heyoung.domain.payment.repository.AccountRepository;
import com.heyoung.domain.payment.repository.TransactionRepository;
import com.heyoung.domain.payment.repository.UserBenefitHistoryRepository;
import com.heyoung.domain.payment.repository.CategoryRepository;

import com.heyoung.domain.user.entity.User;
import com.heyoung.domain.user.repository.UserRepository;
import com.heyoung.global.config.JwtUtil;
import com.heyoung.global.enums.ApplicationType;
import com.heyoung.global.enums.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

import com.heyoung.global.exception.InsufficientBalanceException;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final ExternalBankApiService externalBankApiService;
    private final TransactionRepository transactionRepository;
    private final UserBenefitHistoryRepository userBenefitHistoryRepository;
    private final CategoryRepository categoryRepository;
    private final JwtUtil jwtUtil;
    private final OutBoxCommandService outBoxCommandService;

    // 사용자 qr 데이터
    @Transactional(readOnly = true)
    public QrTokenDto generateQrData(Long memberId) {
        User user = userRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계좌"));
        String qrToken = jwtUtil.generateQrToken(user.getId(), account.getAccountNumber());
        return new QrTokenDto(qrToken);
    }

    // 사용자 잔액 기반 거래 가능 여부 파악 후 출금
    @Transactional
    public TransactionResponseDto executeTransaction(TransactionRequestDto requestDto) {
        QrDataDto qrDataDto = jwtUtil.parseQrToken(requestDto.getQrToken());
        Long userId = qrDataDto.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계좌"));
        Category category = categoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리"));

        // 외부 API 로 잔액 조회
        BigDecimal currentBalance = externalBankApiService.inquireBalance(account.getAccountNumber(), user.getId());

        // 잔액 비교
        if (currentBalance.compareTo(requestDto.getFinalAmount()) < 0) {
            throw new InsufficientBalanceException();
        }

        // 외부 API로 출금
        externalBankApiService.withdraw(
                user.getId(),
                account.getAccountNumber(),
                requestDto.getFinalAmount(),
                requestDto.getTransactionSummary()
        );

        // 거래 기록 생성 및 저장
        Transaction transaction = createTransaction(user, account, category, requestDto);
        Transaction savedTransaction = transactionRepository.save(transaction);

        // 혜택 사용 내역 생성 및 저장
        createUserBenefitHistory(user, savedTransaction, category, requestDto);

        // Outbox 테이블에 트랜잭션 완료 이벤트 저장
        var outboxDto = new com.heyoung.domain.outbox.dto.response.TransactionResponseDto(
                user.getId(),
                category.getId(),
                savedTransaction.getTransactionDateTime()
        );
        outBoxCommandService.saveTransactionOutBox(outboxDto);

        return new TransactionResponseDto(
                savedTransaction.getId(),
                savedTransaction.getStatus().name(),
                requestDto.getFinalAmount(),
                savedTransaction.getDiscountAmount(),
                savedTransaction.getTransactionDateTime()
        );
    }

    // 계좌 거래 내역 전체 조회
    @Transactional(readOnly = true)
    public List<ExternalBankApiDto.TransactionHistory> getTransactionHistory(Long memberId, String startDate, String endDate) {
        User user = userRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계좌"));

        // 외부 API 호출
        ExternalBankApiDto.InquireTransactionHistoryResponse response = externalBankApiService.inquireTransactionHistory(
                memberId,
                account.getAccountNumber(),
                startDate,
                endDate,
                "A",  // "A": 전체 거래 내역
                "DESC" // "DESC": 최신순
        );

        if (response.getRec() == null || response.getRec().getList() == null) {
            return Collections.emptyList();
        }

        return response.getRec().getList();
    }



    private Transaction createTransaction(User user, Account account, Category category, TransactionRequestDto dto) {
        return Transaction.builder()
                .user(user)
                .account(account)
                .partnershipId(dto.getPartnershipId())
                .transactionDateTime(Instant.now())
                .amount(dto.getOriginalAmount())
                .discountAmount(dto.getOriginalAmount().subtract(dto.getFinalAmount()))
                .status(TransactionStatus.SUCCESS)
                .merchantName(dto.getMerchantName())
                .category(category)
                .build();
    }

    // UserBenefitHistory 엔티티 생성 헬퍼 메소드
    private void createUserBenefitHistory(User user, Transaction transaction, Category category, TransactionRequestDto dto) {
        UserBenefitHistory history = UserBenefitHistory.builder()
                .userId(user)
                .transaction(transaction)
                .category(category)
                .partnershipBranchId(dto.getPartnershipBranchId())
                .appliedAmount(dto.getOriginalAmount().subtract(dto.getFinalAmount()))
                .applicationType(ApplicationType.DISCOUNT)
                .build();
        userBenefitHistoryRepository.save(history);
    }

}
