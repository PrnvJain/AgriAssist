package com.kletech.bhoomi.service;

import com.kletech.bhoomi.DTO.GlobalCreditDTO;
import com.kletech.bhoomi.model.GlobalCredit;
import com.kletech.bhoomi.repository.GlobalCreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GlobalCreditService {

    @Autowired
    private GlobalCreditRepository globalCreditRepository;

    public void saveGlobalCreditData(GlobalCreditDTO globalCreditDTO) {
        GlobalCredit globalCredit = new GlobalCredit();

        globalCredit.setNumVehicles(globalCreditDTO.getNumVehicles());
        globalCredit.setNumCattle(globalCreditDTO.getNumCattle());
        globalCredit.setNumWells(globalCreditDTO.getNumWells());
        globalCredit.setNumBorewells(globalCreditDTO.getNumBorewells());
        globalCredit.setCanalWater(globalCreditDTO.getCanalWater());
        globalCredit.setNumLivestock(globalCreditDTO.getNumLivestock());
        globalCredit.setAgriEquipments(globalCreditDTO.getAgriEquipments());
        globalCredit.setAnnualIncome(globalCreditDTO.getAnnualIncome());
        globalCredit.setOtherIncome(globalCreditDTO.getOtherIncome());
        globalCredit.setOutstandingLoans(globalCreditDTO.getOutstandingLoans());
        globalCredit.setLoanType(globalCreditDTO.getLoanType());
        globalCredit.setOutstandingLoanAmount(globalCreditDTO.getOutstandingLoanAmount());
        globalCredit.setBankSavings(globalCreditDTO.getBankSavings());
        globalCredit.setCropInsurance(globalCreditDTO.getCropInsurance());
        globalCredit.setLivestockInsurance(globalCreditDTO.getLivestockInsurance());
        globalCredit.setHealthInsurance(globalCreditDTO.getHealthInsurance());
        
        // // Calculating global credit score (this can be a simple formula or algorithm)
        // double globalCreditScore = calculateGlobalCreditScore(globalCreditDTO);
        // globalCredit.setGlobalCreditScore(globalCreditScore);

        globalCreditRepository.save(globalCredit);
    }

    // // Dummy method to calculate global credit score based on inputs
    // private double calculateGlobalCreditScore(GlobalCreditDTO globalCreditDTO) {
    //     // Example logic to calculate credit score based on some conditions
    //     double score = 0.0;
        
    //     if (globalCreditDTO.getNumVehicles() != null && !globalCreditDTO.getNumVehicles().isEmpty()) {
    //         score += 10;  // Example value
    //     }
    //     if ("yes".equals(globalCreditDTO.getCanalWater())) {
    //         score += 20;
    //     }
    //     if ("yes".equals(globalCreditDTO.getOutstandingLoans())) {
    //         score -= 10; // Decrease if there are outstanding loans
    //     }
    //     if ("agriculture".equals(globalCreditDTO.getLoanType())) {
    //         score += 15;
    //     }
    //     if ("yes".equals(globalCreditDTO.getCropInsurance())) {
    //         score += 10;
    //     }

    //     // Add more logic to calculate the score based on other fields

    //     return score;
    // }
}
