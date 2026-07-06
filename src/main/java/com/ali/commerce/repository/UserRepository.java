package com.ali.commerce.repository;

import com.ali.commerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Crucial for Spring Security and JWT Login
    Optional<User> findByEmail(String email);

    // Crucial for preventing duplicate sign-ups during registration
    boolean existsByEmail(String email);
}