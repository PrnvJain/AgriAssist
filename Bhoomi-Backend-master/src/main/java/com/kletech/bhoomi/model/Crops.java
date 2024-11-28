package com.kletech.bhoomi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Crops {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="cropsId",nullable=false)
    Long cropsId;

    @Column(name = "cropsName",nullable = false)
    String cropsName;

    @Column(name = "cropsType",nullable = false)
    String cropsType;

    @Column(name = "cropsDescription",nullable = false)
    String cropsDescription;

    @Column(name = "cropsDistrict",nullable = false)
    String cropsDistrict;

    @Column(name = "cropsFoundin",nullable = false)
    String cropsFoundin;

    @Column(name = "cropsState",nullable = false)
    String cropsState;

    @Column(name = "cropsThumb",nullable = false)
    String cropsThumb;

}
