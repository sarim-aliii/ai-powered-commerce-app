package com.ali.commerce.repository;

import com.ali.commerce.entity.Order;
import com.ali.commerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Integer userId);

    List<Order> findByUser(User user);
}