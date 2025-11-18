package com.stu.edu.ktx_management.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudentProfileDTO {
    private String username;
    private String fullName;
    private String email;
    private String password;

    private String phone;
    private String className;
    private LocalDate dateOfBirth;
    private Boolean gender;

    public StudentProfileDTO(String username, String fullName, String className) {
        this.username = username;
        this.fullName = fullName;
        this.className = className;
    }
}
