package com.heyoung.domain.university.entity;

import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.StaffRole;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity @Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UniversityStaff extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(length = 50)
    private String orgCode;

    @Column(length = 100)
    private String orgName;

    @Column(length = 50)
    private String positionTitle;

    @Enumerated(EnumType.STRING)
    @Column(length = 16)
    private StaffRole role;

    private Boolean verified;

    @Column(columnDefinition = "text")
    private String verificationNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;
}
