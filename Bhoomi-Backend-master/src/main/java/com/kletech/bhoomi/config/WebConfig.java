package com.kletech.bhoomi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Enable CORS for all endpoints under /api
        registry.addMapping("/api/**") // Allow cross-origin for all API endpoints
            .allowedOrigins("http://localhost:3000") // Your frontend's address
            .allowedMethods("GET", "POST", "PUT", "DELETE") // HTTP methods allowed
            .allowedHeaders("*"); // Allow all headers
    }
}
