package com.ali.commerce.service;

import com.ali.commerce.dto.request.AuthRequest;
import com.ali.commerce.dto.request.UserRequest;
import com.ali.commerce.dto.response.AuthResponse;

public interface AuthService {

    // Registers a new user and returns a JWT token
    AuthResponse register(UserRequest request);

    // Authenticates an existing user and returns a JWT token
    AuthResponse authenticate(AuthRequest request);
}