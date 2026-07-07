package com.ali.commerce.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private Integer userId;
    private String userName; // Good practice to return a readable name to the frontend
    private String status;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items;
}