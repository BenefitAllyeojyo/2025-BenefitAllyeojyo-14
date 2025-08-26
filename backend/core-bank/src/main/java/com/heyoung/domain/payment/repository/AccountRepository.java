package com.heyoung.domain.payment.repository;

import com.heyoung.domain.payment.entity.Account;
import com.heyoung.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
//    // 사용자의 첫 번째 계좌(주계좌)
//    Optional<Account> findFirstByUser(User user);


    Optional<Account> findByUser(User user);
}
