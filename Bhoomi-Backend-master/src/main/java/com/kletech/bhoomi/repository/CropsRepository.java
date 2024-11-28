package com.kletech.bhoomi.repository;

import com.kletech.bhoomi.model.Crops;
import com.kletech.bhoomi.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropsRepository extends JpaRepository<Crops,Long> {
}
