package com.ali.commerce.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {

    // The HTTP status code (e.g., 404, 400, 403)
    private int status;

    // The descriptive error message passed from your exception
    private String message;

    // The exact time the error occurred (useful for logging and debugging)
    private long timestamp;
}