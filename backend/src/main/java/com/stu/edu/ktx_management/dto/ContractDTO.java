package com.stu.edu.ktx_management.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Getter
@Setter
public class ContractDTO {
    private Integer id;
    private String studentName;
    private String studentUsername;
    private String studentEmail;
    private String roomName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;



    public ContractDTO(Integer id, String studentName, String studentUsername, String studentEmail, String roomName, LocalDate startDate, LocalDate endDate, String status) {
        this.id = id;
        this.studentName = studentName;
        this.studentUsername = studentUsername;
        this.studentEmail = studentEmail;
        this.roomName = roomName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
    // getters
}


