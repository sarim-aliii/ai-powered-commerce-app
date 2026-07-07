package com.ali.commerce.repository;

import com.ali.commerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find all orders placed by a specific user
    List<Order> findByUserId(Integer userId);
}