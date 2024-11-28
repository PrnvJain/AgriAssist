package com.kletech.bhoomi.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocalCreditDTO {
    private String fullName;
    private String aadharNumber;
    private String contactNumber;
    private String address;
    private String village;
    private String landArea;
    private String ownershipType;
    private String landUse;
    private String soilType;
    private String irrigation;
    private String cropTypes;
    private String averageYield;
}