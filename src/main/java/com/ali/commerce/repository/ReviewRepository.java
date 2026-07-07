package com.ali.commerce.repository;

import com.ali.commerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Get all reviews for a specific product
    List<Review> findByProductId(Long productId);

    // Get all reviews written by a specific user
    List<Review> findByUserId(Integer userId);

    // Check if a user has already reviewed a product (to prevent spamming)
    boolean existsByUserIdAndProductId(Integer userId, Long productId);
}