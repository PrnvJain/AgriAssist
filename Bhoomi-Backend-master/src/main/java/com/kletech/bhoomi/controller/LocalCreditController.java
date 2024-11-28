package com.kletech.bhoomi.controller;

import com.kletech.bhoomi.DTO.LocalCreditDTO;
import com.kletech.bhoomi.service.LocalCreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class LocalCreditController {

    @Autowired
    private LocalCreditService localCreditService;

    @PostMapping("/local-credit-score")
    public ResponseEntity<String> saveLocalCreditData(@RequestBody LocalCreditDTO localCreditDTO) {
        try {
            localCreditService.saveLocalCreditData(localCreditDTO);
            System.out.println("Received data: " + localCreditDTO);
            return ResponseEntity.ok("Local credit data submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to submit local credit data.");
        }
    }
}
