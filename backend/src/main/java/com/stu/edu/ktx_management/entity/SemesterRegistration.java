package com.stu.edu.ktx_management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "semester_registration")
@Getter
@Setter
public class SemesterRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private Integer registerStartMonth;
    private Integer registerStartDay;

    private Integer registerEndMonth;
    private Integer registerEndDay;

    private Integer contractStartMonth;
    private Integer contractStartDay;

    private Integer contractEndMonth;
    private Integer contractEndDay;

    private Boolean active;
}
