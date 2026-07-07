package com.ali.commerce.service.impl;

import com.ali.commerce.dto.request.CategoryRequest;
import com.ali.commerce.dto.response.CategoryResponse;
import com.ali.commerce.entity.Category;
import com.ali.commerce.mapper.CategoryMapper;
import com.ali.commerce.repository.CategoryRepository;
import com.ali.commerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public String createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists with name: " + request.getName());
        }
        Category category = categoryMapper.toEntity(request);
        categoryRepository.save(category);
        return "Category created successfully";
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return categoryMapper.toResponse(category);
    }

    @Override
    public String updateCategory(Long id, CategoryRequest request) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Check if the new name is already taken by a DIFFERENT category
        if (!existingCategory.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category name already in use");
        }

        existingCategory.setName(request.getName());
        existingCategory.setDescription(request.getDescription());

        categoryRepository.save(existingCategory);
        return "Category updated successfully";
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}