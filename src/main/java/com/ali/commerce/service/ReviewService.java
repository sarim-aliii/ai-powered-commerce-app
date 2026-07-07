package com.ali.commerce.service;

import com.ali.commerce.dto.request.ReviewRequest;
import com.ali.commerce.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse addReview(ReviewRequest request);
    List<ReviewResponse> getReviewsByProduct(Long productId);
    List<ReviewResponse> getReviewsByUser(Integer userId);
    String updateReview(Long id, ReviewRequest request);
    void deleteReview(Long id);
}