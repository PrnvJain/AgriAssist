package com.kletech.bhoomi.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalCreditDTO {

    private String numVehicles;
    private String numCattle;
    private String numWells;
    private String numBorewells;
    private String canalWater;  // yes/no
    private String numLivestock;
    private String agriEquipments;
    private String annualIncome;
    private String otherIncome;
    private String outstandingLoans;  // yes/no
    private String loanType;  // agriculture/other
    private String outstandingLoanAmount;
    private String bankSavings;
    private String cropInsurance;  // yes/no
    private String livestockInsurance;  // yes/no
    private String healthInsurance;  // yes/no
    private double globalCreditScore;  // Calculated global credit score
}
