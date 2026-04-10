package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student/invoices")
@RequiredArgsConstructor
public class StudentInvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public Object getMyInvoices(Authentication authentication) {

        Student user = (Student) authentication.getPrincipal();

        return invoiceService.getByStudent(user.getId());
    }
}

