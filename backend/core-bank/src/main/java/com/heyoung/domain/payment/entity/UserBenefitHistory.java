package com.heyoung.domain.payment.entity;

import com.heyoung.domain.user.entity.User;
import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.ApplicationType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Builder
@AllArgsConstructor
@Entity @Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserBenefitHistory extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long partnershipBranchId;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal appliedAmount;

    @Enumerated(EnumType.STRING)
    @Column(length = 16, nullable = false)
    private ApplicationType applicationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
