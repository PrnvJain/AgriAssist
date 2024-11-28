package com.kletech.bhoomi.service;

import com.kletech.bhoomi.model.MarketData;
import com.kletech.bhoomi.repository.MarketDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarketDataService {
    @Autowired
    private MarketDataRepository marketDataRepository;

    public MarketData addMarketData(MarketData marketData) {
        return marketDataRepository.save(marketData);
    }

    public MarketData updateMarketData(MarketData marketData) {
        if (marketDataRepository.existsById(marketData.getId())) {
            return marketDataRepository.save(marketData);
        }
        return null;
    }

    public MarketData getMarketDataById(Long id) {
        Optional<MarketData> opt = marketDataRepository.findById(id);
        return opt.orElse(null);
    }

    public List<MarketData> getAllMarketData() {
        return marketDataRepository.findAll();
    }

    public MarketData checkFeedbackExist(Long id) {
        Optional<MarketData> opt = marketDataRepository.findById(id);
        return opt.orElse(null);
    }
}
