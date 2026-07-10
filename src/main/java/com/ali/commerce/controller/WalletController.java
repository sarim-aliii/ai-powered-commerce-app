package com.ali.commerce.controller;

import com.ali.commerce.entity.User;
import com.ali.commerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addFunds(Principal principal, @RequestBody Map<String, BigDecimal> request) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal amountToAdd = request.get("amount");

        if (amountToAdd == null || amountToAdd.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid amount"));
        }

        // Add funds and save
        user.setWalletBalance(user.getWalletBalance().add(amountToAdd));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Funds added successfully",
                "newBalance", user.getWalletBalance()
        ));
    }
}