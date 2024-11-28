package com.kletech.bhoomi.repository;

import com.kletech.bhoomi.model.Crops;
import com.kletech.bhoomi.model.MarketData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketDataRepository extends JpaRepository<MarketData,Long> {
}
