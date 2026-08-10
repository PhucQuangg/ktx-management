package com.stu.edu.ktx_management.dto;

import com.stu.edu.ktx_management.entity.Invoice;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class InvoiceDTO {

    private Integer id;

    private String studentName;

    private String roomName;

    private String month;

    private Double roomPrice;

    private Double serviceFee;

    private Double totalAmount;

    private String status;

    private LocalDate dueDate;

    private List<InvoiceServiceDTO> services;

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

        this.services = i.getInvoiceServices()
                .stream()
                .map(InvoiceServiceDTO::new)
                .toList();
    }

}