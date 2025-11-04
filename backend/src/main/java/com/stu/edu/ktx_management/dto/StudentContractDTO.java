package com.stu.edu.ktx_management.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class StudentContractDTO {
    private Integer id;
    private String roomName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Double price;
}
