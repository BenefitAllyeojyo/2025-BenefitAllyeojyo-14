package com.heyoung.domain.benefit.entity;

import com.heyoung.domain.university.entity.University;
import com.heyoung.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 제휴 중에 캠퍼스 별로 사용한 기록 남기는 것!
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UniversityPartnership extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int useCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partnership_branch_id", nullable = false)
    private PartnershipBranch partnershipBranch;

}
