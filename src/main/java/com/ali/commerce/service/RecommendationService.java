package com.ali.commerce.service;

import com.ali.commerce.dto.response.ProductResponse;
import com.ali.commerce.entity.Order;
import com.ali.commerce.entity.Product;
import com.ali.commerce.mapper.ProductMapper;
import com.ali.commerce.repository.OrderRepository;
import com.ali.commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public List<Product> getPersonalizedRecommendations(Integer userId, int limit) {

        // 1. Fetch all orders for this user
        List<Order> userOrders = orderRepository.findByUserId(userId);

        // 2. Extract unique Product IDs the user has historically purchased
        List<Long> purchasedProductIds = userOrders.stream()
                .flatMap(order -> order.getItems().stream())
                .map(orderItem -> orderItem.getProduct().getId())
                .distinct()
                .collect(Collectors.toList());

        // 3. The "Cold Start" Scenario
        if (purchasedProductIds.isEmpty()) {
            return productRepository.findTopTrendingProducts(limit);
        }

        // 4. Fetch Collaborative Filtering Recommendations
        List<Product> recommendations = productRepository
                .findRecommendationsByCollaborativeFiltering(purchasedProductIds, limit);

        // 5. Fallback in case the user's purchased items haven't been bought by anyone else
        if (recommendations.isEmpty() || recommendations.size() < limit) {
            List<Product> trending = productRepository.findTopTrendingProducts(limit);

            // Add trending products to fill the quota, ensuring no duplicates
            for (Product trend : trending) {
                if (recommendations.size() >= limit) break;
                if (!recommendations.contains(trend) && !purchasedProductIds.contains(trend.getId())) {
                    recommendations.add(trend);
                }
            }
        }

        return recommendations;
    }


    public List<ProductResponse> getRecommendationDTOs(Integer userId, int limit) {
        List<Product> products = getPersonalizedRecommendations(userId, limit);
        return products.stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
}