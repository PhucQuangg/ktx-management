package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/invoices")
@RequiredArgsConstructor
public class StudentInvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<?> getMyInvoices(Authentication auth) {
        String username = auth.getName();
        return ResponseEntity.ok(invoiceService.getByStudent(username));
    }
}

