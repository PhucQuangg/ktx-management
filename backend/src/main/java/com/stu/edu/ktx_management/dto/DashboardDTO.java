package com.stu.edu.ktx_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardDTO {

    private Long totalStudents;

    private Long totalRooms;

    private Long availableRooms;

    private Long fullRooms;

    private Long activeContracts;
    private Long totalInvoices;

    private Long unpaidInvoices;

    private Long paidInvoices;

    private Long unpaidAmount;

    private Long revenue;
}