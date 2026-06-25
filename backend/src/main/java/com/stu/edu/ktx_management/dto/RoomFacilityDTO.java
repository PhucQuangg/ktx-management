package com.stu.edu.ktx_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomFacilityDTO {

    private Integer id;

    private Integer roomId;

    private String roomName;

    private Integer facilityTypeId;

    private String facilityName;

    private Integer quantity;

    private String status;
}