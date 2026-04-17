package com.stu.edu.ktx_management.service;



import com.stu.edu.ktx_management.dto.CreateInvoiceRequest;
import com.stu.edu.ktx_management.dto.InvoiceDTO;
import com.stu.edu.ktx_management.entity.*;
import com.stu.edu.ktx_management.repository.ContractRepository;
import com.stu.edu.ktx_management.repository.InvoiceRepository;
import com.stu.edu.ktx_management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ContractRepository contractRepository;
    private final StudentRepository studentRepository;
    private final EmailService emailService;

    private final Double SERVICE_FEE = 350000.0;

    public Invoice createInvoice(CreateInvoiceRequest request) {

        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new RuntimeException("Chỉ hợp đồng ACTIVE mới tạo được hóa đơn");
        }


        // ✅ CHECK THÁNG
        YearMonth currentMonth = YearMonth.now();
        YearMonth requestMonth = YearMonth.parse(request.getMonth());

        if (!requestMonth.equals(currentMonth)) {
            throw new RuntimeException("Chỉ được tạo hóa đơn tháng hiện tại");
        }

        // ✅ CHECK TRÙNG
        boolean exists = invoiceRepository
                .existsByContractIdAndMonth(contract.getId(), request.getMonth());

        if (exists) {
            throw new RuntimeException("Hóa đơn đã tồn tại");
        }

        Double roomPrice = contract.getRoom().getPrice();

        Invoice invoice = Invoice.builder()
                .contract(contract)
                .student(contract.getStudent())
                .room(contract.getRoom())
                .month(request.getMonth())
                .roomPrice(roomPrice)
                .serviceFee(SERVICE_FEE)
                .totalAmount(roomPrice + SERVICE_FEE)
                .status(InvoiceStatus.UNPAID)
                .dueDate(LocalDate.now().plusDays(7))
                .createdAt(LocalDateTime.now())
                .build();


        return invoiceRepository.save(invoice);

    }

    public int generateInvoices(String month) {

        // ✅ VALIDATE MONTH NULL
        if (month == null || month.isBlank()) {
            throw new RuntimeException("Tháng không hợp lệ");
        }

        // ✅ VALIDATE FORMAT YYYY-MM
        YearMonth requestMonth;
        try {
            requestMonth = YearMonth.parse(month);
        } catch (Exception e) {
            throw new RuntimeException("Format tháng phải là YYYY-MM");
        }

        // ✅ (OPTION) CHỈ CHO TẠO THÁNG HIỆN TẠI
        YearMonth currentMonth = YearMonth.now();
        if (!requestMonth.equals(currentMonth)) {
            throw new RuntimeException("Chỉ được tạo hóa đơn tháng hiện tại");
        }

        // ✅ LẤY CONTRACT ACTIVE
        List<Contract> contracts = contractRepository.findAll()
                .stream()
                .filter(c -> c.getStatus() == ContractStatus.ACTIVE)
                .toList();

        int createdCount = 0;

        for (Contract contract : contracts) {

            // ❗ CHECK TRÙNG
            boolean exists = invoiceRepository
                    .existsByContractIdAndMonth(contract.getId(), month);

            if (exists) continue;

            Double roomPrice = contract.getRoom().getPrice();

            Invoice invoice = Invoice.builder()
                    .contract(contract)
                    .student(contract.getStudent())
                    .room(contract.getRoom())
                    .month(month)
                    .roomPrice(roomPrice)
                    .serviceFee(SERVICE_FEE)
                    .totalAmount(roomPrice + SERVICE_FEE)
                    .status(InvoiceStatus.UNPAID)
                    .dueDate(LocalDate.now().plusDays(7))
                    .createdAt(LocalDateTime.now())
                    .build();

            invoiceRepository.save(invoice);
            createdCount++;
        }

        return createdCount;
    }


    public List<InvoiceDTO> getAll() {
        List<Invoice> invoices = invoiceRepository.findAll();

        return invoices.stream()
                .map(InvoiceDTO::new)
                .toList();

    }

    public List<InvoiceDTO> getByStudent(String username) {

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy student"));

        return invoiceRepository.findByStudentId(student.getId())
                .stream()
                .map(inv -> new InvoiceDTO(inv))
                .toList();
    }


    public Invoice getById(Integer id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    public Invoice markAsPaid(Integer id) {
        Invoice invoice = getById(id);
        invoice.setStatus(InvoiceStatus.PAID);
        return invoiceRepository.save(invoice);
    }
    public List<InvoiceDTO> filter(String status, String month, String roomName) {

        InvoiceStatus st = null;

        if (status != null && !status.isBlank()) {
            st = InvoiceStatus.valueOf(status);
        }

        if (roomName != null && roomName.isBlank()) {
            roomName = null;
        }

        List<Invoice> invoices = invoiceRepository.filter(st, month, roomName);

        return invoices.stream()
                .map(InvoiceDTO::new)
                .toList();

    }

    public int remindAllInvoices() {

        List<Invoice> invoices = invoiceRepository.findUnpaidInvoices();

        int count = 0;

        for (Invoice inv : invoices) {
            try {
                emailService.sendReminderEmails(inv);
                count++;
            } catch (Exception e) {
                throw new RuntimeException("Lỗi gửi email invoice");
            }
        }

        return count;
    }


}

