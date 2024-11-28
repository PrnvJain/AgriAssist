package com.kletech.bhoomi.service;

import com.kletech.bhoomi.model.Crops;
import com.kletech.bhoomi.model.InfoData;
import com.kletech.bhoomi.repository.CropsRepository;
import com.kletech.bhoomi.repository.InfoDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InfoDataService {
    @Autowired
    private InfoDataRepository infoDataRepository;

    public InfoData addInfoData(InfoData infoData) {
//        List<Student> list = studentRepository.findByPhoneNumberOrEmailId(student.getPhoneNumber(), student.getEmailId());
//        if(!list.isEmpty())
//            return null;
        return infoDataRepository.save(infoData);
    }

    public InfoData updateInfoData(InfoData crops) {
        if (infoDataRepository.existsById(crops.getId())) {
            return infoDataRepository.save(crops);
        }
        return null;
    }

    public InfoData getInfoDataById(Long id) {
        Optional<InfoData> opt = infoDataRepository.findById(id);
        if (opt.isPresent())
            return opt.get();
        else
            return null;
    }

    public List<InfoData> getAllInfoData() {
        List<InfoData> infoDataList = infoDataRepository.findAll();
        return infoDataList;
    }

    public InfoData checkInfoDataExist(Long id) {
        InfoData infoData = infoDataRepository.findById(id).get();
        return infoData; //Student does not exist
    }
}
