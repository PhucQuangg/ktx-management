package com.stu.edu.ktx_management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "facility_types")
@Getter
@Setter
@NoArgsConstructor
public class FacilityType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    @OneToMany(mappedBy = "facilityType")
    private List<RoomFacility> roomFacilities;
}