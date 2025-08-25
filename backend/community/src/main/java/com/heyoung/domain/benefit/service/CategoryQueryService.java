package com.heyoung.domain.benefit.service;

import com.heyoung.domain.benefit.entity.Category;

public interface CategoryQueryService {
    Category findById(Long id);
}
