package com.kletech.bhoomi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedbackId", nullable = false)
    Long feedbackId;

    @Column(name = "feedbackName", nullable = false)
    String feedbackName;

    @Column(name = "feedbackSuggestion", nullable = false)
    String feedbackSuggestion;
}




