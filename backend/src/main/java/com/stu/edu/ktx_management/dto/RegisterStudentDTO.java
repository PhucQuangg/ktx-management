package com.stu.edu.ktx_management.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterStudentDTO {

    private String username;

    private String password;

    private String email;

    private String fullName;

    private LocalDate dateOfBirth;

    private Boolean gender;

    private String phone;

    private String className;


    private ResidenceInfoDTO residenceInfo;
}