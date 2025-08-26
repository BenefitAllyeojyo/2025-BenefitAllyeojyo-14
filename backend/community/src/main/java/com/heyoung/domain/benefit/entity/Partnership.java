package com.heyoung.domain.benefit.entity;

import com.heyoung.domain.university.entity.University;
import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.PartnershipStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity @Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Partnership extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String companyName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal discountRate;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal discountAmount;

    @Column(columnDefinition = "text", nullable = false)
    private String terms;

    @Column(columnDefinition = "text")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(length = 16, nullable = false)
    private PartnershipStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @OneToMany(mappedBy = "partnership", fetch = FetchType.LAZY) // 이미지 조회를 위한 양방향 매핑
    private List<PartnershipImage> partnershipImages = new ArrayList<>();

	@OneToMany(mappedBy = "partnership", fetch = FetchType.LAZY)
	private List<PartnershipBranch> partnershipBranches = new ArrayList<>();
}
