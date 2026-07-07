package com.ali.commerce.service;

import com.ali.commerce.dto.request.OrderRequest;
import com.ali.commerce.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(Long id);
    List<OrderResponse> getOrdersByUser(Integer userId);
    String updateOrderStatus(Long id, String status);
    void deleteOrder(Long id);
}