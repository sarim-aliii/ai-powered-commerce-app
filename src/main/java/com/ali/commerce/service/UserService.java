package com.ali.commerce.service;

import com.ali.commerce.dto.response.UserResponse;
import com.ali.commerce.entity.User;

import java.util.List;

public interface UserService {
    UserResponse createUser(User request);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Integer id);
    UserResponse updateUser(Integer id, User request);
    void deleteUser(Integer id);
}