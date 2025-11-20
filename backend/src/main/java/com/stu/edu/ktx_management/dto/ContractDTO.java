package com.stu.edu.ktx_management.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ContractDTO {
    private Integer id;
    private Integer studentId;
    private String studentName;
    private String studentEmail;
    private String roomName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    public ContractDTO(Integer studentId, String studentName, String studentEmail, String roomName, LocalDate startDate, LocalDate endDate, String status) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.roomName = roomName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}
