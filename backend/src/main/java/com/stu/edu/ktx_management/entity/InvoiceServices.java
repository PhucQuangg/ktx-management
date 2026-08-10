package com.stu.edu.ktx_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invoice_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceServices {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    private Double amount;
}