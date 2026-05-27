package com.stu.edu.ktx_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FinancialDTO {

    private Long totalRevenue;

    private Long paidInvoices;

    private Long unpaidInvoices;

    private Long unpaidAmount;
}