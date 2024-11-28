package com.kletech.bhoomi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class LocalCredit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String fullName;

    @Column(nullable = true)
    private String aadharNumber;

    @Column(nullable = true)
    private String contactNumber;

    @Column(nullable = true)
    private String address;

    @Column(nullable = true)
    private String village;

    @Column(nullable = true)
    private String landArea;

    @Column(nullable = true)
    private String ownershipType;

    @Column(nullable = true)
    private String landUse;

    @Column(nullable = true)
    private String soilType;

    @Column(nullable = true)
    private String irrigation;

    @Column(nullable = true)
    private String cropTypes;

    @Column(nullable = true)
    private String averageYield;

    // No default constructor needed for null fields
}
