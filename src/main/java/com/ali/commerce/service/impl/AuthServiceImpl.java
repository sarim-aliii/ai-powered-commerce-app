package com.ali.commerce.service.impl;

import com.ali.commerce.dto.request.AuthRequest;
import com.ali.commerce.dto.request.UserRequest;
import com.ali.commerce.dto.response.AuthResponse;
import com.ali.commerce.entity.User;
import com.ali.commerce.repository.UserRepository;
import com.ali.commerce.security.JwtService;
import com.ali.commerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    public AuthResponse register(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Default to CUSTOMER if no role is provided
        user.setRole(request.getRole() != null ? request.getRole().toUpperCase() : "CUSTOMER");

        userRepository.save(user);

        // Generate the JWT token for the newly registered user
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder().token(jwtToken).build();
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        // This will automatically check the password against the encoded password in the database
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // If we reach here, the password is correct. Fetch the user and generate a token.
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder().token(jwtToken).build();
    }
}