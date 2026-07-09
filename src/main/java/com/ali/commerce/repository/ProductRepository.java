package com.ali.commerce.repository;

import com.ali.commerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByName(String name);

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByBrand(String brand);

    boolean existsByName(String name);

    List<Product> findByPriceLessThan(BigDecimal price);

    List<Product> findByQuantityGreaterThan(Integer quantity);

    List<Product> findByBrandAndCategoryId(String brand, Long categoryId);

    List<Product> findByNameContainingIgnoreCase(String keyword);

    /**
     * Collaborative Filtering: Finds products bought by other users who purchased
     * the same items as the target user, excluding items the target user already bought.
     */
    @Query(value = "SELECT p.* FROM products p " +
            "JOIN order_items oi ON p.id = oi.product_id " +
            "JOIN orders o ON oi.order_id = o.id " +
            "WHERE o.user_id IN (" +
            "    SELECT DISTINCT o2.user_id FROM orders o2 " +
            "    JOIN order_items oi2 ON o2.id = oi2.order_id " +
            "    WHERE oi2.product_id IN :purchasedProductIds" +
            ") " +
            "AND p.id NOT IN :purchasedProductIds " +
            "GROUP BY p.id " +
            "ORDER BY COUNT(p.id) DESC " +
            "LIMIT :limit", nativeQuery = true)
    List<Product> findRecommendationsByCollaborativeFiltering(
            @Param("purchasedProductIds") List<Long> purchasedProductIds,
            @Param("limit") int limit
    );

    /**
     * Fallback for new users: Gets the most popular products across the entire store.
     */
    @Query(value = "SELECT p.* FROM products p " +
            "JOIN order_items oi ON p.id = oi.product_id " +
            "GROUP BY p.id " +
            "ORDER BY SUM(oi.quantity) DESC " +
            "LIMIT :limit", nativeQuery = true)
    List<Product> findTopTrendingProducts(@Param("limit") int limit);
}