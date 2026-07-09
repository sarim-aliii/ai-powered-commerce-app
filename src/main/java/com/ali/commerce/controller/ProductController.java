package com.ali.commerce.controller;

import com.ali.commerce.dto.request.ProductRequest;
import com.ali.commerce.dto.response.ProductResponse;
import com.ali.commerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.ali.commerce.dto.response.VisualSearchResponse;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Create a new product
    @PostMapping
    public ResponseEntity<String> addProduct(@Valid @RequestBody ProductRequest request) {
        String response = productService.addProduct(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get a specific product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    // Get all products
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> responses = productService.getAllProducts();
        return ResponseEntity.ok(responses);
    }

    // Update an existing product
    @PutMapping("/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        String response = productService.updateProduct(id, request);
        return ResponseEntity.ok(response);
    }

    // Delete a product
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        String response = productService.deleteById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam String query) {
        return ResponseEntity.ok(productService.searchProducts(query));
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<String> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        productService.updateProductImage(id, file);

        return ResponseEntity.ok("Image uploaded successfully");
    }

    @PostMapping("/search/visual")
    public ResponseEntity<List<ProductResponse>> visualSearch(@RequestParam("file") MultipartFile file) {
        // 1. Prepare the image to send to Python
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // 2. Ask Python for the similar IDs
        VisualSearchResponse pythonResponse = restTemplate.postForObject(
                "http://localhost:8000/search",
                requestEntity,
                VisualSearchResponse.class
        );

        // 3. Get the actual full product details from your database using those IDs
        List<Long> similarIds = pythonResponse.getSimilarProductIds();

        // Note: You will need to make sure your ProductService has a method
        // like getProductsByIds(List<Long> ids) to fetch these from the database.
        List<ProductResponse> products = productService.getProductsByIds(similarIds);

        return ResponseEntity.ok(products);
    }
}