package com.ali.commerce.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;

    // You could also add user details here if your frontend needs them immediately upon login
    // private String name;
    // private String email;
    // private String role;
}