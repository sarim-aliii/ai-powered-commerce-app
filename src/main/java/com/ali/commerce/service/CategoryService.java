package com.ali.commerce.service;

import com.ali.commerce.dto.request.CategoryRequest;
import com.ali.commerce.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    String createCategory(CategoryRequest request);
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);
    String updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
}