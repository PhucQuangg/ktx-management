package com.stu.edu.ktx_management.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stu.edu.ktx_management.entity.ApprovalStatus;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProfileDTO {
    private Integer id;
    private String username;
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String className;
    private LocalDate dateOfBirth;
    private Boolean gender;
    private String role;
    private ResidenceInfoDTO residenceInfo;
    private ApprovalStatus approvalStatus;

}
