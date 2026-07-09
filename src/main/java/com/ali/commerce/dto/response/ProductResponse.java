package com.ali.commerce.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;

    private Long categoryId;
    private String categoryName;

    private String brand;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}