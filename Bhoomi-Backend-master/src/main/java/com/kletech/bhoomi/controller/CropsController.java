package com.kletech.bhoomi.controller;

import com.kletech.bhoomi.Commons.Constants;
import com.kletech.bhoomi.model.Crops;
import com.kletech.bhoomi.model.Feedback;
import com.kletech.bhoomi.service.CropsService;
import com.kletech.bhoomi.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = Constants.crossOrigins)
@RestController
@RequestMapping("/crops")
public class CropsController {
    @Autowired
    CropsService cropsService;

    @PostMapping("/add")
    public Crops addCrops(@RequestBody() Crops crops) {
        return cropsService.addCrops(crops);
    }

    @GetMapping("/getall")
    public List<Crops> getAllCrops() {
        return cropsService.getAllCrops();
    }

}
