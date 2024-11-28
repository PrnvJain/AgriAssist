package com.kletech.bhoomi.controller;

import com.kletech.bhoomi.Commons.Constants;
import com.kletech.bhoomi.model.Crops;
import com.kletech.bhoomi.model.InfoData;
import com.kletech.bhoomi.service.CropsService;
import com.kletech.bhoomi.service.InfoDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = Constants.crossOrigins)
@RestController
@RequestMapping("/infodata")
public class InfoDataController {
    @Autowired
    InfoDataService infoDataService;

    @PostMapping("/add")
    public InfoData addInfoData(@RequestBody() InfoData infoData) {
        return infoDataService.addInfoData(infoData);
    }

    @GetMapping("/getall")
    public List<InfoData> getAllInfoData() {
        return infoDataService.getAllInfoData();
    }

}
