package com.ali.commerce.service.impl;

import com.ali.commerce.repository.CategoryRepository;
import com.ali.commerce.entity.Category;

import com.ali.commerce.dto.request.ProductRequest;
import com.ali.commerce.dto.response.ProductResponse;
import com.ali.commerce.entity.Product;
import com.ali.commerce.mapper.ProductMapper;
import com.ali.commerce.repository.ProductRepository;
import com.ali.commerce.service.ProductService;
import com.ali.commerce.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id)); // You can replace this with ProductNotFoundException later

        return productMapper.toResponse(product);
    }

    @Override
    public List<ProductResponse> getProductsByIds(List<Long> ids) {
        List<Product> products = productRepository.findAllById(ids);

        return products.stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    public String deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        productRepository.deleteById(id);
        return "Product deleted successfully";
    }

    @Override
    public Long addProduct(ProductRequest request) {
        // 1. Map your request to the entity (you likely already have this logic)
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setBrand(request.getBrand());

        // Fetch and set the category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);

        // 2. Save the product to the database
        Product savedProduct = productRepository.save(product);

        return savedProduct.getId();
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public String updateProduct(Long id, ProductRequest request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // 1. Fetch the new category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        existingProduct.setName(request.getName());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setQuantity(request.getQuantity());
        existingProduct.setBrand(request.getBrand());

        // 2. Update the category association
        existingProduct.setCategory(category);

        productRepository.save(existingProduct);

        return "Product updated successfully";
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateProductImage(Long id, MultipartFile file) {
        try {
            // 1. Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadFile(file);

            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            product.setImageUrl(imageUrl);
            productRepository.save(product);

            // 2. Send to Python Microservice for indexing
            try {
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);

                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

                ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
                    }
                };

                body.add("file", fileAsResource);

                HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
                String pythonUrl = "http://localhost:8000/index-product?product_id=" + id;

                restTemplate.postForEntity(pythonUrl, requestEntity, String.class);
                System.out.println("Successfully sent image to AI for indexing!");

            } catch (Exception e) {
                System.err.println("Failed to index image for visual search: " + e.getMessage());
            }

        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }
}