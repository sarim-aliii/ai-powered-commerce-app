package com.ali.commerce.service.impl;

import com.ali.commerce.dto.request.ReviewRequest;
import com.ali.commerce.dto.response.ReviewResponse;
import com.ali.commerce.entity.Product;
import com.ali.commerce.entity.Review;
import com.ali.commerce.entity.User;
import com.ali.commerce.mapper.ReviewMapper;
import com.ali.commerce.repository.ProductRepository;
import com.ali.commerce.repository.ReviewRepository;
import com.ali.commerce.repository.UserRepository;
import com.ali.commerce.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public ReviewResponse addReview(ReviewRequest request) {
        // 1. Prevent duplicate reviews
        if (reviewRepository.existsByUserIdAndProductId(request.getUserId(), request.getProductId())) {
            throw new RuntimeException("User has already reviewed this product.");
        }

        // 2. Fetch User and Product
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 3. Map and link
        Review review = reviewMapper.toEntity(request);
        review.setUser(user);
        review.setProduct(product);

        Review savedReview = reviewRepository.save(review);
        return reviewMapper.toResponse(savedReview);
    }

    @Override
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }
        return reviewRepository.findByProductId(productId).stream()
                .map(reviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByUser(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        return reviewRepository.findByUserId(userId).stream()
                .map(reviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public String updateReview(Long id, ReviewRequest request) {
        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Update rating and comment
        existingReview.setRating(request.getRating());
        existingReview.setComment(request.getComment());

        reviewRepository.save(existingReview);
        return "Review updated successfully";
    }

    @Override
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found");
        }
        reviewRepository.deleteById(id);
    }
}