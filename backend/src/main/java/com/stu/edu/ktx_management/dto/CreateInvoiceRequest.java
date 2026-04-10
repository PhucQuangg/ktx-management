package com.stu.edu.ktx_management.dto;


import lombok.Data;

@Data
public class CreateInvoiceRequest {
    private Integer contractId;
    private String month;
}
