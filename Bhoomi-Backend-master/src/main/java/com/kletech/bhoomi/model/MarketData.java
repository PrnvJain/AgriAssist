package com.kletech.bhoomi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MarketData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id",nullable=false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "purchase_date", nullable = false)
    private String purchaseDate;

    @Column(name = "year", nullable = false)
    private int year;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "place", nullable = false)
    private String place;

    @Column(name = "rating", nullable = false)
    private int rating;

}
