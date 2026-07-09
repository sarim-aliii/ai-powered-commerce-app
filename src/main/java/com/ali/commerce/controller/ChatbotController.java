package com.ali.commerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatbotController {

    @PostMapping
    public ResponseEntity<Map<String, String>> chatWithAI(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");

        // Prepare the request to send to Python
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> pythonRequest = new HashMap<>();
        pythonRequest.put("message", userMessage);

        try {
            // Forward message to the Python Agent
            Map<String, String> pythonResponse = restTemplate.postForObject(
                    "http://localhost:8000/chat",
                    pythonRequest,
                    Map.class
            );

            return ResponseEntity.ok(pythonResponse);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("reply", "Sorry, the AI support agent is currently offline.");
            return ResponseEntity.ok(errorResponse);
        }
    }
}