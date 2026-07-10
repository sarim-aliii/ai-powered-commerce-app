package com.ali.commerce.repository;

import com.ali.commerce.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    Optional<Coupon> findByCode(String code);
    List<Coupon> findByIsActiveTrue();
}