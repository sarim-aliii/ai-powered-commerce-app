package com.ali.commerce.mapper;

import com.ali.commerce.dto.request.OrderRequest;
import com.ali.commerce.dto.response.OrderItemResponse;
import com.ali.commerce.dto.response.OrderResponse;
import com.ali.commerce.entity.Order;
import com.ali.commerce.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public Order toEntity(OrderRequest request) {
        if (request == null) return null;
        Order order = new Order();
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus("PENDING");
        // We will calculate totalAmount and set Items in the Service
        return order;
    }

    public OrderResponse toResponse(Order order) {
        if (order == null) return null;

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userName(order.getUser() != null ? order.getUser().getName() : null)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .items(itemResponses) // Add the items here
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProduct() != null ? item.getProduct().getName() : null)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build();
    }
}