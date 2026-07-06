package com.ali.commerce.service;

import com.ali.commerce.dto.response.ProductResponse;
import com.ali.commerce.entity.Product;

import java.util.List;

public interface ProductService {

    ProductResponse getProductById(Long id);

    String deleteById(Long id);

    String addProduct(Product request);

    List<ProductResponse> getAllProducts();

    String updateProduct(Long id, Product request);
}