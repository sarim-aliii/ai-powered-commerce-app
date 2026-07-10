package com.ali.commerce.service;

import com.ali.commerce.dto.request.AuthRequest;
import com.ali.commerce.dto.request.RegisterRequest;
import com.ali.commerce.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse authenticate(AuthRequest request);
}