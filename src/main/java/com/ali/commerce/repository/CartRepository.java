package com.ali.commerce.repository;

import com.ali.commerce.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Find a cart by the user's ID
    Optional<Cart> findByUserId(Integer userId);
}