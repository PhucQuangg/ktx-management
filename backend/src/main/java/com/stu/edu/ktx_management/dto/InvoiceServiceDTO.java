package com.stu.edu.ktx_management.dto;

import com.stu.edu.ktx_management.entity.InvoiceServices;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceServiceDTO {

    private Integer id;

    private String name;

    private Double amount;

    public InvoiceServiceDTO(InvoiceServices invoiceService){

        this.id = invoiceService.getId();

        this.name = invoiceService.getService().getName();

        this.amount = invoiceService.getAmount();

    }

}