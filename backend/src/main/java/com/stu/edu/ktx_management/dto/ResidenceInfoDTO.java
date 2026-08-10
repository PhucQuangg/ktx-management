package com.stu.edu.ktx_management.dto;

import com.stu.edu.ktx_management.entity.ResidenceInfo;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class ResidenceInfoDTO {

    private String identityNumber;

    private LocalDate identityIssueDate;

    private String identityIssuePlace;

    private String nationality;

    private String placeOfBirth;

    private String ethnicity;

    private String religion;

    private String province;

    private String district;

    private String ward;

    private String address;

    public ResidenceInfoDTO(ResidenceInfo residence) {

        this.identityNumber = residence.getIdentityNumber();
        this.identityIssueDate = residence.getIdentityIssueDate();
        this.identityIssuePlace = residence.getIdentityIssuePlace();

        this.nationality = residence.getNationality();
        this.placeOfBirth = residence.getPlaceOfBirth();
        this.ethnicity = residence.getEthnicity();
        this.religion = residence.getReligion();

        this.province = residence.getProvince();
        this.district = residence.getDistrict();
        this.ward = residence.getWard();
        this.address = residence.getAddress();
    }
}