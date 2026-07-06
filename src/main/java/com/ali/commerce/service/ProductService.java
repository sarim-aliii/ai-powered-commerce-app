package com.ali.commerce.service;

import com.ali.commerce.entity.Product;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;

public interface ProductService {
    public Product getProductById(@PathVariable Integer id);

    public String deleteById(Integer id);

    public String addProduct(Product product);

    public List<Product> getAllProducts();

    public String updateProduct(Integer id, Product product);
}
