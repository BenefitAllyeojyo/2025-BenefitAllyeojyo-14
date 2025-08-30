package com.heyoung.domain.benefit.service;

import com.heyoung.domain.benefit.entity.Category;
import com.heyoung.domain.benefit.exception.advice.CategoryControllerAdvice;
import com.heyoung.domain.benefit.repository.CategoryRepository;
import com.heyoung.global.exception.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryQueryServiceImpl implements CategoryQueryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Category findById(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new CategoryControllerAdvice(ResponseCode.CATEGORY_NOT_FOUND));
    }

}
