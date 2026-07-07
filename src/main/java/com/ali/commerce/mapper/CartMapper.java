package com.ali.commerce.mapper;

import com.ali.commerce.dto.response.CartItemResponse;
import com.ali.commerce.dto.response.CartResponse;
import com.ali.commerce.entity.Cart;
import com.ali.commerce.entity.CartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartResponse toResponse(Cart cart) {
        if (cart == null) return null;

        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());

        // Calculate the total cost of everything currently in the cart
        BigDecimal cartTotal = itemResponses.stream()
                .map(CartItemResponse::getItemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser() != null ? cart.getUser().getId() : null)
                .items(itemResponses)
                .cartTotal(cartTotal)
                .build();
    }

    private CartItemResponse toItemResponse(CartItem item) {
        BigDecimal unitPrice = item.getProduct().getPrice();
        BigDecimal itemTotal = unitPrice.multiply(new BigDecimal(item.getQuantity()));

        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .unitPrice(unitPrice)
                .itemTotal(itemTotal)
                .build();
    }
}