package com.stu.edu.ktx_management.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "username",nullable = false,unique = true)
    private String username;
    @Column(name = "password",nullable = false)
    private String password;
    @Column(name = "full_name")
    private String fullName;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date created_at = new Date();

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private Boolean gender;

    private String phone;
    @Column(name = "class_name")
    private String className;
}
