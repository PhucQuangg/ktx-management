package com.stu.edu.ktx_management.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoomDetailDTO {

    private Integer id;

    private String name;

    private Integer capacity;

    private Integer current_people;

    private Double price;

    private String status;

    private String type;

    private List<RoomFacilityDTO> facilities;
}
