package com.kletech.bhoomi.service;

import com.kletech.bhoomi.DTO.LocalCreditDTO;
import com.kletech.bhoomi.model.LocalCredit;
import com.kletech.bhoomi.repository.LocalCreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocalCreditService {

    @Autowired
    private LocalCreditRepository localCreditRepository;

    public void saveLocalCreditData(LocalCreditDTO localCreditDTO) {
        LocalCredit localCredit = new LocalCredit();

        localCredit.setFullName(localCreditDTO.getFullName());
        localCredit.setAadharNumber(localCreditDTO.getAadharNumber());
        localCredit.setContactNumber(localCreditDTO.getContactNumber());
        localCredit.setAddress(localCreditDTO.getAddress());
        localCredit.setVillage(localCreditDTO.getVillage());
        localCredit.setLandArea(localCreditDTO.getLandArea());
        localCredit.setOwnershipType(localCreditDTO.getOwnershipType());
        localCredit.setLandUse(localCreditDTO.getLandUse());
        localCredit.setSoilType(localCreditDTO.getSoilType());
        localCredit.setIrrigation(localCreditDTO.getIrrigation());
        localCredit.setCropTypes(localCreditDTO.getCropTypes());
        localCredit.setAverageYield(localCreditDTO.getAverageYield());

        localCreditRepository.save(localCredit);
    }
}
