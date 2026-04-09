package com.stu.edu.ktx_management.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private String fullName;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String className;
    private LocalDate dateOfBirth;
    private Boolean gender;
    private String role;
    private String approvalStatus;

    public StudentDTO(String fullName, String username, String className) {
        this.fullName = fullName;
        this.username = username;
        this.className = className;
    }
}
