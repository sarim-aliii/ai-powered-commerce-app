package com.ali.commerce.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String description;
    private  double price;
    private Integer quantity;
    private String category;
    private String brand;
    private Date createdAt;
    private Date updatedAt;
}
