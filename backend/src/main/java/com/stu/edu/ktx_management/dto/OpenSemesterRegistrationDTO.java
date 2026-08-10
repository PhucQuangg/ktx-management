package com.stu.edu.ktx_management.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class OpenSemesterRegistrationDTO {

    private Integer semesterId;

    private LocalDate startDate;

    private LocalDate endDate;
}