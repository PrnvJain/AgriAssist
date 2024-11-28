package com.kletech.bhoomi.controller;

import com.kletech.bhoomi.Commons.Constants;
import com.kletech.bhoomi.model.MarketData;
import com.kletech.bhoomi.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = Constants.crossOrigins)
@RestController
@RequestMapping("/marketdata")
public class MarketDataController {
    @Autowired
    MarketDataService marketDataService;

    @PostMapping("/add")
    public MarketData addMarketData(@RequestBody MarketData marketData) {
        return marketDataService.addMarketData(marketData);
    }

    @GetMapping("/getall")
    public List<MarketData> getAllMarketData() {
        return marketDataService.getAllMarketData();
    }
}
