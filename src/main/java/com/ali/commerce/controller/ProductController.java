package com.ali.commerce.controller;

import com.ali.commerce.entity.Product;
import com.ali.commerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {
    @Autowired
    ProductService productService;

    @PostMapping("/api/products")
    public String addProduct(Product product){
        String response = productService.addProduct(product);
        return response;
    }

    @GetMapping("/api/products")
    public List<String> getAllProducts(){
        List<String> products = productService.getAllProducts();
        return products;
    }

    @GetMapping("/api/products/{id}")
    public String getProductById(@PathVariable Integer id){
        String response = productService.getProductById(id);
        return response;
    }

    @PutMapping("/api/products/{id}")
    public String updateProduct(@PathVariable Integer id){
        String response = productService.updateProduct(id);
        return response;
    }

    @DeleteMapping("/api/products/{id}")
    public String deleteProduct(@PathVariable Integer id){
        String response = productService.deleteById(id);
        return response;
    }
}
