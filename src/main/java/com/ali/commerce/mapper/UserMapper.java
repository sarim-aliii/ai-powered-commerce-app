package com.ali.commerce.mapper;

import com.ali.commerce.dto.request.UserRequest;
import com.ali.commerce.dto.response.UserResponse;
import com.ali.commerce.entity.User;

public class UserMapper {
    public static User toEntity(UserRequest dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        return user;
    }

    public static UserResponse toResponseDTO(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public static void updateEntity(User user, UserRequest dto) {
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
    }
}