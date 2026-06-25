package com.stu.edu.ktx_management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "student_verification")
@Getter
@Setter
@NoArgsConstructor
public class StudentVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "Ma_so_sinh_vien")
    private String mssv;

    private String fullName;

    private String className;

    private String email;
    private LocalDate dateOfBirth;
    @Enumerated(EnumType.STRING)
    private VerificationStatus status;
}
