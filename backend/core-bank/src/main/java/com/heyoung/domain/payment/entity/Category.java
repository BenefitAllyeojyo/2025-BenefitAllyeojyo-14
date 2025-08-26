package com.heyoung.domain.payment.entity;

import com.heyoung.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity @Getter
@NoArgsConstructor
public class Category extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name; // 카테고리 이름
    @Column(nullable = false)
    private String code; // 카테고리 코드
}
