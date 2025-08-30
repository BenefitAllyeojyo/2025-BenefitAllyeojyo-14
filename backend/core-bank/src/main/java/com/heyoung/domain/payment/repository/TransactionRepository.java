package com.heyoung.domain.payment.repository;

import java.util.Optional;

import com.heyoung.domain.payment.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	Optional<Transaction> findByUserId(Long id);
}
