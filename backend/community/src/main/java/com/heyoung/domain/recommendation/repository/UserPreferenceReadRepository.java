package com.heyoung.domain.recommendation.repository;

import com.heyoung.domain.benefit.entity.Category;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserPreferenceReadRepository extends Repository<Category, Long> {

    interface CatPrefRow {
        Long getCategoryId();
        Long getUseCount();
    }

    @Query("""
        select uc.category.id as category, uc.useCount as useCount
        from UserCategory uc
        where uc.userId = :userId
          and (:catsEmpty = true or uc.category.id in :cats)
        """)
    List<CatPrefRow> findCategoryCounts(@Param("userId") Long userId,
                                        @Param("catsEmpty") boolean catsEmpty,
                                        @Param("cats") List<Long> cats);

}
