package com.ali.commerce.mapper;

import com.ali.commerce.dto.request.UserRequest;
import com.ali.commerce.dto.response.UserResponse;
import com.ali.commerce.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequest request) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // IMPORTANT: The password here is still plain-text.
        // It MUST be encoded in the Service layer before calling repository.save()
        user.setPassword(request.getPassword());
        user.setRole("CUSTOMER");

        return user;
    }

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public void updateEntity(User user, UserRequest request) {
        if (request == null) {
            return;
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Again, ensure the password is encrypted in the service layer if it is being updated
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
    }
}