package com.ali.commerce.mapper;

import com.ali.commerce.dto.request.ProductRequest;
import com.ali.commerce.dto.response.ProductResponse;
import com.ali.commerce.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    // Converts incoming DTO to Entity for saving to the database
    public Product toEntity(ProductRequest request) {
        if (request == null) {
            return null;
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());

        return product;
    }

    // Converts database Entity to DTO for returning to the client
    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .category(product.getCategory())
                .brand(product.getBrand())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}