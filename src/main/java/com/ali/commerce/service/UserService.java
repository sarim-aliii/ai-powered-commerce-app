package com.ali.commerce.service;

import com.ali.commerce.dto.response.UserResponse;
import com.ali.commerce.dto.request.UserRequest;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Integer id);
    UserResponse updateUser(Integer id, UserRequest request);
    void deleteUser(Integer id);
}