package com.ali.commerce.controller;

import com.ali.commerce.dto.response.ApiResponse;
import com.ali.commerce.dto.response.ProductResponse;
import com.ali.commerce.entity.User;
import com.ali.commerce.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getRecommendations(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "10") int limit
    ) {
        // We use @AuthenticationPrincipal to get the logged-in user securely
        List<ProductResponse> recommendations =
                recommendationService.getRecommendationDTOs(currentUser.getId(), limit);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Recommendations fetched successfully", recommendations)
        );
    }
}