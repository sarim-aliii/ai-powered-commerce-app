package com.ali.commerce.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid // Validates the objects inside the list
    private List<OrderItemRequest> items;
}