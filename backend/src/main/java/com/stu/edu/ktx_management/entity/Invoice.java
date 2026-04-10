package com.stu.edu.ktx_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    private String month;

    private Double roomPrice;
    private Double serviceFee;
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    private LocalDate dueDate;

    private LocalDateTime createdAt;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;


    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

}

