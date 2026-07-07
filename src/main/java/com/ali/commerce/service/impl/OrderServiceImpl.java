package com.ali.commerce.service.impl;

import com.ali.commerce.dto.request.OrderRequest;
import com.ali.commerce.dto.response.OrderResponse;
import com.ali.commerce.entity.Order;
import com.ali.commerce.entity.User;
import com.ali.commerce.mapper.OrderMapper;
import com.ali.commerce.repository.OrderRepository;
import com.ali.commerce.repository.ProductRepository;
import com.ali.commerce.repository.UserRepository;
import com.ali.commerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // 1. Fetch User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderMapper.toEntity(request);
        order.setUser(user);

        BigDecimal totalAmount = BigDecimal.ZERO;

        // 2. Process each requested item
        for (OrderItemRequest itemRequest : request.getItems()) {
            // Fetch the product
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemRequest.getProductId()));

            // 3. Check Inventory
            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient inventory for product: " + product.getName() + ". Only " + product.getQuantity() + " left.");
                // Note: Better to use your custom InventoryException here if you have one.
            }

            // 4. Deduct Inventory
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            productRepository.save(product); // Save the updated stock

            // 5. Create the OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice()); // Lock in the historical price

            // Add item to the order's list
            order.getItems().add(orderItem);

            // 6. Calculate total amount
            BigDecimal lineTotal = product.getPrice().multiply(new BigDecimal(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);
        }

        order.setTotalAmount(totalAmount);

        // 7. Save the Order (Because of CascadeType.ALL, this will automatically save the OrderItems too!)
        Order savedOrder = orderRepository.save(order);

        return orderMapper.toResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return orderMapper.toResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByUser(Integer userId) {
        // Validate user exists first (optional but good practice)
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public String updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        order.setStatus(status.toUpperCase());
        orderRepository.save(order);

        return "Order status updated successfully to " + status.toUpperCase();
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
}