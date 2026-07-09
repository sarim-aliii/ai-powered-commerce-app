package com.ali.commerce.service;

import com.ali.commerce.dto.response.ProductResponse;
import com.ali.commerce.dto.request.ProductRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    ProductResponse getProductById(Long id);

    String deleteById(Long id);

    String addProduct(ProductRequest request);

    List<ProductResponse> getAllProducts();

    String updateProduct(Long id, ProductRequest request);

    List<ProductResponse> searchProducts(String query);

    void updateProductImage(Long id, MultipartFile file);

    List<ProductResponse> getProductsByIds(List<Long> ids);
}