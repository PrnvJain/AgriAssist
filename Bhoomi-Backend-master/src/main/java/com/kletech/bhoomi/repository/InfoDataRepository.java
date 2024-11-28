package com.kletech.bhoomi.repository;

import com.kletech.bhoomi.model.Crops;
import com.kletech.bhoomi.model.InfoData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InfoDataRepository extends JpaRepository<InfoData,Long> {
}
