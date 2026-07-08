package com.ali.commerce.controller;

import com.ali.commerce.dto.response.UserResponse;
import com.ali.commerce.dto.request.UserRequest;
import com.ali.commerce.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create User
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@RequestBody UserRequest request) {
        return userService.createUser(request);
    }

    // Get All Users
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get User By Id
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    // Update User
    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Integer id, @RequestBody UserRequest request) {
        return userService.updateUser(id, request);
    }

    // Delete User
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }
}