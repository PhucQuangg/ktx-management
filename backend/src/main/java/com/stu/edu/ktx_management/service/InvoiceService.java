package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.dto.InvoiceDTO;
import com.stu.edu.ktx_management.entity.*;
import com.stu.edu.ktx_management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final ContractRepository contractRepository;

    private final StudentRepository studentRepository;

    private final EmailService emailService;

    private final PdfInvoiceService pdfInvoiceService;

    private final ServiceRepository serviceRepository;

    private final InvoiceServiceRepository invoiceServiceRepository;

    public int generateInvoices(String month) {

        if (month == null || month.isBlank()) {
            throw new RuntimeException("Tháng không hợp lệ");
        }

        YearMonth requestMonth;

        try {
            requestMonth = YearMonth.parse(month);
        } catch (Exception e) {
            throw new RuntimeException("Format tháng phải là YYYY-MM");
        }

        YearMonth currentMonth = YearMonth.now();

        if (!requestMonth.equals(currentMonth)) {
            throw new RuntimeException(
                    "Chỉ được tạo hóa đơn tháng hiện tại"
            );
        }

        List<Contract> contracts =
                contractRepository.findAll()
                        .stream()
                        .filter(c -> c.getStatus() == ContractStatus.ACTIVE)

                        .filter(c -> c.getStartDate() != null)

                        .filter(c -> c.getEndDate() != null)

                        .filter(c -> {
                            YearMonth startMonth =
                                    YearMonth.from(
                                            c.getStartDate()
                                    );

                            YearMonth endMonth =
                                    YearMonth.from(
                                            c.getEndDate()
                                    );

                            return !requestMonth.isBefore(startMonth) && !requestMonth.isAfter(endMonth);
                        })

                        .toList();

        int createdCount = 0;

        for (Contract contract : contracts) {

            boolean exists = invoiceRepository.existsByContractIdAndMonth(contract.getId(), month);

            if (exists) {
                continue;
            }

            Double roomPrice = contract.getRoom().getPrice();

            List<Services> services = serviceRepository.findAll();

            double totalService = services.stream()
                            .mapToDouble(
                                    Services::getPrice
                            )
                            .sum();
            Invoice invoice =
                    Invoice.builder()
                            .contract(contract)
                            .student(contract.getStudent())
                            .room(contract.getRoom())
                            .month(month)
                            .roomPrice(roomPrice)
                            .serviceFee(totalService)
                            .totalAmount(roomPrice + totalService)
                            .status(InvoiceStatus.UNPAID)
                            .dueDate(LocalDate.now().plusDays(7))
                            .createdAt(LocalDateTime.now()
                            )
                            .build();

            Invoice savedInvoice = invoiceRepository.save(invoice);

            for (Services service : services) {

                InvoiceServices invoiceService =
                        InvoiceServices.builder()

                                .invoice(savedInvoice)
                                .service(service)
                                .amount(service.getPrice())
                                .build();

                invoiceServiceRepository.save(invoiceService);
            }

            createdCount++;
        }

        return createdCount;
    }

    public List<InvoiceDTO> getByStudent(String username) {

        Student student = studentRepository.findByUsernameIgnoreCase(username)
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

    @Transactional
    public Invoice markAsPaid(Integer invoiceId) {
        Invoice invoice =
                invoiceRepository
                        .findById(invoiceId)
                        .orElseThrow(() ->
                                        new RuntimeException(
                                                "Không tìm thấy hóa đơn."
                                        )
                        );

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new RuntimeException(
                    "Hóa đơn này đã được thanh toán."
            );
        }

        invoice.setStatus(InvoiceStatus.PAID);

        Invoice savedInvoice = invoiceRepository.saveAndFlush(invoice);

        emailService.sendPaymentSuccessEmail(savedInvoice.getId());


        return savedInvoice;
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

    public File generatePdf(Integer id) throws Exception {

        Invoice invoice = getById(id);

        return pdfInvoiceService.generateInvoicePdf(invoice);
    }
}

