package com.ali.commerce.service.impl;

import com.ali.commerce.dto.response.ProductResponse;
import com.ali.commerce.entity.Product;
import com.ali.commerce.mapper.ProductMapper;
import com.ali.commerce.repository.ProductRepository;
import com.ali.commerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

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
    public String addProduct(Product request) {
        // Optional: Check if a product with the exact same name already exists
        if (productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Product already exists with name: " + request.getName()); // Replace with DuplicateProductException later
        }

        Product product = productMapper.toEntity(request);
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
    public String updateProduct(Long id, Product request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Update fields manually
        existingProduct.setName(request.getName());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setQuantity(request.getQuantity());
        existingProduct.setCategory(request.getCategory());
        existingProduct.setBrand(request.getBrand());

        productRepository.save(existingProduct);

        return "Product updated successfully";
    }
}