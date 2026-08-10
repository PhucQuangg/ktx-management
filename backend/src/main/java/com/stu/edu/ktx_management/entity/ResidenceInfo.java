package com.stu.edu.ktx_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "residence_info")
public class ResidenceInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    @JsonIgnore
    private Student student;

    @Column(name = "identity_number")
    private String identityNumber;

    @Column(name = "identity_issue_date")
    private LocalDate identityIssueDate;

    @Column(name = "identity_issue_place")
    private String identityIssuePlace;

    private String nationality;

    private String placeOfBirth;

    private String ethnicity;

    private String religion;

    private String province;

    private String district;

    private String ward;

    private String address;
}