package com.stu.edu.ktx_management.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Getter
@Setter

public class StudentContractDTO {
    private Integer id;
    private String roomName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    public StudentContractDTO(Integer id, String roomName,
                              LocalDate startDate, LocalDate endDate,
                              String status) {
        this.id = id;
        this.roomName = roomName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    // getter
}

