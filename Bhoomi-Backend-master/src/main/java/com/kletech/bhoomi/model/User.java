package com.kletech.bhoomi.model;


import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="userId",nullable=false)
    Long userId;

    @Column(name = "userFirstName",nullable = false)
    String userFirstName;

    @Column(name = "userLastName",nullable = false)
    String userLastName;

    @Column(name = "userEmail",nullable = false)
    String userEmail;

    @Column(name = "userPhone",nullable = false)
    String userPhone;

    @Column(name = "userState",nullable = false)
    String userState;

    @Column(name = "userPassword",nullable = false)
    String userPassword;
}

