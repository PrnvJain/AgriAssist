package com.kletech.bhoomi.repository;

import com.kletech.bhoomi.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
}
