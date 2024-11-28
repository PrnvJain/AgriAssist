package com.kletech.bhoomi.controller;

import com.kletech.bhoomi.DTO.GlobalCreditDTO;
import com.kletech.bhoomi.service.GlobalCreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class GlobalCreditController {

    @Autowired
    private GlobalCreditService globalCreditService;

    @PostMapping("/global-credit-score")
    public ResponseEntity<String> saveGlobalCreditData(@RequestBody GlobalCreditDTO globalCreditDTO) {
        try {
            globalCreditService.saveGlobalCreditData(globalCreditDTO);
            System.out.println("Received data: " + globalCreditDTO);
            return ResponseEntity.ok("Global credit score data submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to submit global credit score data.");
        }
    }
}
