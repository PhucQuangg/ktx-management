package com.stu.edu.ktx_management.dto;

import com.stu.edu.ktx_management.entity.Contract;
import com.stu.edu.ktx_management.entity.Invoice;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InvoiceDTO {

    public Integer id;
    public String studentName;
    public String roomName;
    public String month;

    public Double roomPrice;
    public Double serviceFee;
    public Double totalAmount;

    public String status;
    public LocalDate dueDate;

    public InvoiceDTO(Invoice i) {
        this.id = i.getId();
        this.studentName = i.getStudent().getFullName();
        this.roomName = i.getRoom().getName();
        this.month = i.getMonth();

        this.roomPrice = i.getRoomPrice();
        this.serviceFee = i.getServiceFee();
        this.totalAmount = i.getTotalAmount();

        this.status = i.getStatus().name();
        this.dueDate = i.getDueDate();
    }
}
