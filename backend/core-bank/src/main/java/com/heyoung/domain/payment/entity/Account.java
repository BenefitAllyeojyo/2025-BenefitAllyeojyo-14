package com.heyoung.domain.payment.entity;

import com.heyoung.domain.user.entity.User;
import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.BankCode;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity @Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(uniqueConstraints = @UniqueConstraint(name="uq_account_number", columnNames="account_number"))
public class Account extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String accountNumber;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal balance;

    @Column(length = 50, nullable = false)
    private String bankName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BankCode bankCode;

    @Column(length = 100, nullable = false)
    private String holderName;

    @Column(precision = 15, scale = 2)
    private BigDecimal dailyLimit;

    @Column(precision = 15, scale = 2)
    private BigDecimal perTransferLimit;

    private LocalDate openedDate;

    private Boolean verified;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
