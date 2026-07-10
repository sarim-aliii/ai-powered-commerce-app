package com.ali.commerce.controller;

import com.ali.commerce.entity.Coupon;
import com.ali.commerce.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    // Get all active coupons for the Offers page
    @GetMapping("/active")
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        return ResponseEntity.ok(couponRepository.findByIsActiveTrue());
    }

    // Validate coupon from the Cart page
    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam String code) {
        Optional<Coupon> couponOpt = couponRepository.findByCode(code.toUpperCase());

        if (couponOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid coupon code"));
        }

        Coupon coupon = couponOpt.get();

        if (!coupon.isActive() || coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Coupon has expired or is inactive"));
        }

        return ResponseEntity.ok(Map.of(
                "code", coupon.getCode(),
                "discountPercentage", coupon.getDiscountPercentage()
        ));
    }
}