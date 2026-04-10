package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.dto.CreateInvoiceRequest;
import com.stu.edu.ktx_management.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/invoices")
@RequiredArgsConstructor
public class AdminInvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateInvoiceRequest request) {
        try {
            return ResponseEntity.ok(invoiceService.createInvoice(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> body) {
        try {
            invoiceService.generateInvoices(body.get("month"));
            return ResponseEntity.ok("Tạo hóa đơn hàng loạt thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String roomName
    ) {
        try {
            return ResponseEntity.ok(
                    invoiceService.filter(status, month, roomName)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(invoiceService.markAsPaid(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/remind")
    public ResponseEntity<?> remindAll() {
        try {
            int total = invoiceService.remindAllInvoices();
            return ResponseEntity.ok("Đã gửi " + total + " email nhắc nhở thanh toán!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
