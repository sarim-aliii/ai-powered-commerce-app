package com.ali.commerce.mapper;

import com.ali.commerce.dto.request.ReviewRequest;
import com.ali.commerce.dto.response.ReviewResponse;
import com.ali.commerce.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public Review toEntity(ReviewRequest request) {
        if (request == null) return null;

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        // User and Product will be mapped in the Service layer
        return review;
    }

    public ReviewResponse toResponse(Review review) {
        if (review == null) return null;

        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct() != null ? review.getProduct().getId() : null)
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .userName(review.getUser() != null ? review.getUser().getName() : null)
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}