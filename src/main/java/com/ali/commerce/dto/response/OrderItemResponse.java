package com.ali.commerce.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price; // Price per unit at the time of purchase
}