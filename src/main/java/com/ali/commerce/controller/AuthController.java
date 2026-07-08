package com.ali.commerce.controller;

import com.ali.commerce.dto.request.AuthRequest;
import com.ali.commerce.dto.request.UserRequest;
import com.ali.commerce.dto.response.AuthResponse;
import com.ali.commerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // This handles POST http://localhost:8080/api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // This handles POST http://localhost:8080/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}