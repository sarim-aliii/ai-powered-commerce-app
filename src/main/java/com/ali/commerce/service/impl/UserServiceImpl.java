package com.ali.commerce.service.impl;

import com.ali.commerce.dto.response.UserResponse;
import com.ali.commerce.dto.request.UserRequest;
import com.ali.commerce.entity.User;
import com.ali.commerce.mapper.UserMapper;
import com.ali.commerce.repository.UserRepository;
import com.ali.commerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered"); // Can be replaced with a custom exception
        }

        User user = userMapper.toEntity(request);

        // Hash the password before saving to the database
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(Integer id, UserRequest request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Use the mapper to apply updates
        userMapper.updateEntity(existingUser, request);

        // Re-encode the password if it was updated
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteUser(Integer id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        userRepository.delete(existingUser);
    }
}