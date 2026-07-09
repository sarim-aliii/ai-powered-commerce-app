package com.ali.commerce.controller;

import com.ali.commerce.dto.request.CategoryRequest;
import com.ali.commerce.dto.request.ProductRequest;
import com.ali.commerce.service.OrderService;
import com.ali.commerce.service.ProductService;
import com.ali.commerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrderService orderService;
    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<String> addCategory(@RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping(value = "/products/add", consumes = {"multipart/form-data"})
    public ResponseEntity<String> addProduct(
            @RequestPart("product") ProductRequest productRequest,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        // 1. Save the product and capture the generated ID
        Long newProductId = productService.addProduct(productRequest);

        // 2. If the admin uploaded an image, save it using the new ID
        if (image != null && !image.isEmpty()) {
            productService.updateProductImage(newProductId, image);
        }

        return ResponseEntity.ok("Product added successfully");
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        // Calls the existing update logic in your ProductService
        String response = productService.updateProduct(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.deleteById(id));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        String response = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(response);
    }
}