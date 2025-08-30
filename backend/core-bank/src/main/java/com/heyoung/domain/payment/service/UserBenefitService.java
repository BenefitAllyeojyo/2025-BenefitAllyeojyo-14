package com.heyoung.domain.payment.service;

import com.heyoung.domain.payment.dto.UserTotalSavingsDto;
import com.heyoung.domain.payment.repository.UserBenefitHistoryRepository;
import com.heyoung.domain.user.entity.User;
import com.heyoung.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserBenefitService {
    private final UserRepository userRepository;
    private final UserBenefitHistoryRepository userBenefitHistoryRepository;

    @Transactional(readOnly = true)
    public UserTotalSavingsDto getTotalSavings(Long memberId) {
        User user = userRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));
        BigDecimal totalSavings = userBenefitHistoryRepository.findTotalAppliedAmountByUser(user);

        // 혜택 내역 없어 SUM 결과가 null이면 0으로 처리
        BigDecimal result = Optional.ofNullable(totalSavings).orElse(BigDecimal.ZERO);
        return new UserTotalSavingsDto(memberId, result);
    }
}
