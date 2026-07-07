package com.ali.commerce.service;

import com.ali.commerce.dto.request.CartItemRequest;
import com.ali.commerce.dto.response.CartResponse;

public interface CartService {
    CartResponse getCartByUserId(Integer userId);
    CartResponse addItemToCart(Integer userId, CartItemRequest request);
    CartResponse removeItemFromCart(Integer userId, Long productId);
    void clearCart(Integer userId);
}