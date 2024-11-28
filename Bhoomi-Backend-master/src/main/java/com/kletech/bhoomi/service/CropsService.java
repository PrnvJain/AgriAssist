package com.kletech.bhoomi.service;

import com.kletech.bhoomi.model.Crops;
import com.kletech.bhoomi.model.Feedback;
import com.kletech.bhoomi.repository.CropsRepository;
import com.kletech.bhoomi.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CropsService {
    @Autowired
    private CropsRepository cropsRepository;

    public Crops addCrops(Crops crops) {
//        List<Student> list = studentRepository.findByPhoneNumberOrEmailId(student.getPhoneNumber(), student.getEmailId());
//        if(!list.isEmpty())
//            return null;
        return cropsRepository.save(crops);
    }

    public Crops updateCrops(Crops crops) {
        if (cropsRepository.existsById(crops.getCropsId())) {
            return cropsRepository.save(crops);
        }
        return null;
    }

    public Crops getCropsById(Long id) {
        Optional<Crops> opt = cropsRepository.findById(id);
        if (opt.isPresent())
            return opt.get();
        else
            return null;
    }

    public List<Crops> getAllCrops() {
        List<Crops> cropsList = cropsRepository.findAll();
        return cropsList;
    }

    public Crops checkFeedbackExist(Long id) {
        Crops feedback = cropsRepository.findById(id).get();
        return feedback; //Student does not exist
    }
}
