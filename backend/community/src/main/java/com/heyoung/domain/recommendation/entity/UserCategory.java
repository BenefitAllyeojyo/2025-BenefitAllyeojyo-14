package com.heyoung.domain.recommendation.entity;

import com.heyoung.domain.benefit.entity.Category;
import com.heyoung.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * 유저가 많이 사용한 카테고리 카운트.
 */
@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserCategory extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private int useCount = 0;

    public static UserCategory from(Long userId, Category category) {
        UserCategory userCategory = new UserCategory();
        userCategory.setUserId(userId);
        userCategory.setCategory(category);
        userCategory.setUseCount(1);

        return userCategory;
    }

    public void plusUseCount() {
        this.useCount += 1;
    }
}
