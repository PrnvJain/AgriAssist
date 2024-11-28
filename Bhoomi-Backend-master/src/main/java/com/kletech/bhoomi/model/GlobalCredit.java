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
public class GlobalCredit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String numVehicles;

    @Column(nullable = true)
    private String numCattle;

    @Column(nullable = true)
    private String numWells;

    @Column(nullable = true)
    private String numBorewells;

    @Column(nullable = true)
    private String canalWater;

    @Column(nullable = true)
    private String numLivestock;

    @Column(nullable = true)
    private String agriEquipments;

    @Column(nullable = true)
    private String annualIncome;

    @Column(nullable = true)
    private String otherIncome;

    @Column(nullable = true)
    private String outstandingLoans;

    @Column(nullable = true)
    private String loanType;

    @Column(nullable = true)
    private String outstandingLoanAmount;

    @Column(nullable = true)
    private String bankSavings;

    @Column(nullable = true)
    private String cropInsurance;

    @Column(nullable = true)
    private String livestockInsurance;

    @Column(nullable = true)
    private String healthInsurance;

    @Column(nullable = true)
    private Double globalCreditScore;

    @Column(nullable = true)
    private String aadharNumber;

    // No default constructor needed for null fields
}
