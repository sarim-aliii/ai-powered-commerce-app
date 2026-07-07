package com.ali.commerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutRequest {

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
}