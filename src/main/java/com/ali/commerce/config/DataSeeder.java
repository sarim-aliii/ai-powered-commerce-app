package com.ali.commerce.config;

import com.ali.commerce.entity.Category;
import com.ali.commerce.entity.Coupon;
import com.ali.commerce.entity.Product;
import com.ali.commerce.repository.CategoryRepository;
import com.ali.commerce.repository.CouponRepository;
import com.ali.commerce.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    public DataSeeder(CategoryRepository categoryRepository,
                      ProductRepository productRepository,
                      CouponRepository couponRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0 && productRepository.count() == 0) {
            System.out.println("🌱 Seeding database with test data...");

            // 1. Create Categories
            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setDescription("Gadgets, smartphones, and laptops.");

            Category clothing = new Category();
            clothing.setName("Clothing");
            clothing.setDescription("Apparel for men and women.");

            Category home = new Category();
            home.setName("Home & Kitchen");
            home.setDescription("Appliances and furniture for your home.");

            categoryRepository.saveAll(Arrays.asList(electronics, clothing, home));

            // 2. Create Products
            Product smartphone = new Product();
            smartphone.setName("ProVision Smartphone");
            smartphone.setBrand("TechCorp");
            smartphone.setDescription("Latest 5G smartphone with an incredible camera and all-day battery life.");
            smartphone.setPrice(new BigDecimal("799.99"));
            smartphone.setQuantity(50);
            smartphone.setCategory(electronics);
            smartphone.setImageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop");

            Product laptop = new Product();
            laptop.setName("UltraBook Pro 15");
            laptop.setBrand("ComputeX");
            laptop.setDescription("High-performance laptop for developers and creators. 16GB RAM, 1TB SSD.");
            laptop.setPrice(new BigDecimal("1299.00"));
            laptop.setQuantity(30);
            laptop.setCategory(electronics);
            laptop.setImageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop");

            Product coffeeMaker = new Product();
            coffeeMaker.setName("Barista Express");
            coffeeMaker.setBrand("HomeBrew");
            coffeeMaker.setDescription("Automatic espresso machine with integrated grinder for café-quality coffee at home.");
            coffeeMaker.setPrice(new BigDecimal("450.00"));
            coffeeMaker.setQuantity(15);
            coffeeMaker.setCategory(home);
            coffeeMaker.setImageUrl("https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=800&auto=format&fit=crop");

            Product jacket = new Product();
            jacket.setName("Classic Denim Jacket");
            jacket.setBrand("UrbanWear");
            jacket.setDescription("Vintage style denim jacket, perfect for all seasons. Durable and comfortable.");
            jacket.setPrice(new BigDecimal("89.50"));
            jacket.setQuantity(100);
            jacket.setCategory(clothing);
            jacket.setImageUrl("https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800&auto=format&fit=crop");

            productRepository.saveAll(Arrays.asList(smartphone, laptop, coffeeMaker, jacket));

            System.out.println("✅ Categories and Products seeded successfully.");
        }

        // Only seed coupons if there are none
        if (couponRepository.count() == 0) {
            Coupon welcomeCoupon = new Coupon();
            welcomeCoupon.setCode("WELCOME20");
            welcomeCoupon.setDiscountPercentage(new BigDecimal("20.00"));
            welcomeCoupon.setExpiryDate(LocalDateTime.now().plusMonths(6));
            welcomeCoupon.setActive(true);

            Coupon flashSale = new Coupon();
            flashSale.setCode("FLASHSALE50");
            flashSale.setDiscountPercentage(new BigDecimal("50.00"));
            flashSale.setExpiryDate(LocalDateTime.now().plusDays(3));
            flashSale.setActive(true);

            couponRepository.saveAll(Arrays.asList(welcomeCoupon, flashSale));
            System.out.println("✅ Coupons seeded successfully.");
        }
    }
}