package com.ali.commerce.service.impl;

import com.ali.commerce.repository.CategoryRepository;
import com.ali.commerce.entity.Category;

import com.ali.commerce.dto.request.ProductRequest;
import com.ali.commerce.dto.response.ProductResponse;
import com.ali.commerce.entity.Product;
import com.ali.commerce.mapper.ProductMapper;
import com.ali.commerce.repository.ProductRepository;
import com.ali.commerce.service.ProductService;
import com.ali.commerce.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id)); // You can replace this with ProductNotFoundException later

        return productMapper.toResponse(product);
    }

    @Override
    public String deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        productRepository.deleteById(id);
        return "Product deleted successfully";
    }

    @Override
    public String addProduct(ProductRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Product already exists with name: " + request.getName());
        }

        // 1. Fetch the category from the database
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        // 2. Map the request to a Product entity
        Product product = productMapper.toEntity(request);

        // 3. Attach the actual Category entity to the Product
        product.setCategory(category);

        productRepository.save(product);

        return "Product added successfully";
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public String updateProduct(Long id, ProductRequest request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // 1. Fetch the new category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        existingProduct.setName(request.getName());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setQuantity(request.getQuantity());
        existingProduct.setBrand(request.getBrand());

        // 2. Update the category association
        existingProduct.setCategory(category);

        productRepository.save(existingProduct);

        return "Product updated successfully";
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateProductImage(Long id, MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadFile(file);

            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            product.setImageUrl(imageUrl);
            productRepository.save(product);

        } catch (java.io.IOException e) {
            // Catch the checked exception and wrap it in a RuntimeException
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }
}