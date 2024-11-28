package com.kletech.bhoomi.repository;

import com.kletech.bhoomi.model.FaqData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaqDataRepository extends JpaRepository<FaqData, Long> {
    // You can add custom query methods here if needed
}
