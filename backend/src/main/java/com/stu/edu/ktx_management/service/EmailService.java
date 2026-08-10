package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.entity.Contract;
import com.stu.edu.ktx_management.entity.Invoice;
import com.stu.edu.ktx_management.entity.Student;

import com.stu.edu.ktx_management.repository.InvoiceRepository;
import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.File;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private final InvoiceRepository invoiceRepository;

    private final PdfInvoiceService pdfInvoiceService;

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private static final NumberFormat MONEY_FORMATTER =
            NumberFormat.getNumberInstance(
                    new Locale("vi", "VN")
            );

    @Async
    public void sendApprovalEmail(Student student) {

        if (!hasValidEmail(student)) {
            return;
        }

        String subject = "Thông báo duyệt hồ sơ đăng ký nội trú";

        String content = String.format(
                """
                Chào %s,

                Hồ sơ đăng ký nội trú của bạn đã được phê duyệt.

                Thông tin tài khoản:
                - Tên đăng nhập: %s
                - Mật khẩu mặc định: 12345678

                Vui lòng đăng nhập vào hệ thống và đổi mật khẩu sau lần truy cập đầu tiên.

                Trân trọng,
                Ban Quản lý Ký túc xá STU
                """,
                getStudentName(student),
                getStudentUsername(student)
        );

        sendMail(student.getEmail(), subject, content);
    }

    @Async
    public void sendCreatedEmail(Student student) {

        if (!hasValidEmail(student)) {
            return;
        }

        String subject = "Thông báo tạo hồ sơ đăng ký nội trú";

        String content = String.format(
                """
                Chào %s,

                Hồ sơ đăng ký nội trú của bạn đã được tạo thành công.

                Thông tin tài khoản:
                - Tên đăng nhập: %s
                - Mật khẩu mặc định: 12345678

                Vui lòng đăng nhập vào hệ thống và đổi mật khẩu sau lần truy cập đầu tiên.

                Trân trọng,
                Ban Quản lý Ký túc xá STU
                """,
                getStudentName(student),
                getStudentUsername(student)
        );

        sendMail(student.getEmail(), subject, content);
    }

    @Async
    public void sendRejectionEmail(Student student, String reason) {

        if (!hasValidEmail(student)) {
            return;
        }

        String subject = "Thông báo từ chối hồ sơ đăng ký nội trú";

        String content = String.format(
                """
                Chào %s,

                Rất tiếc, hồ sơ đăng ký nội trú của bạn chưa được phê duyệt.

                Lý do:
                %s

                Vui lòng kiểm tra lại thông tin hoặc liên hệ Ban Quản lý Ký túc xá để được hỗ trợ.

                Trân trọng,
                Ban Quản lý Ký túc xá STU
                """,
                getStudentName(student),
                normalizeReason(reason)
        );

        sendMail(student.getEmail(), subject, content);
    }

    @Async
    public void sendApprovalContract(Student student, Contract contract) {

        if (!hasValidEmail(student) || contract == null) {
            return;
        }

        String subject = "Thông báo duyệt đăng ký phòng nội trú";

        String content = String.format(
                """
                Chào %s,

                Ban Quản lý Ký túc xá thông báo đăng ký phòng của bạn đã được phê duyệt thành công.

                Sau khi được phê duyệt, đăng ký phòng đã chuyển thành hợp đồng nội trú đang hiệu lực.

                Thông tin hợp đồng:
                - Phòng: %s
                - Ngày bắt đầu: %s
                - Ngày kết thúc: %s
                - Trạng thái: Đang hiệu lực

                Vui lòng đăng nhập vào hệ thống để kiểm tra thông tin hợp đồng và theo dõi các hóa đơn liên quan.

                Trân trọng,
                Ban Quản lý Ký túc xá STU
                """,
                getStudentName(student),
                getRoomName(contract),
                formatDate(contract.getStartDate()),
                formatDate(contract.getEndDate())
        );

        sendMail(student.getEmail(), subject, content);
    }

    @Async
    public void sendRejectionContract(Contract contract, String reason) {

        if (contract == null || contract.getStudent() == null) {
            return;
        }

        Student student = contract.getStudent();

        if (!hasValidEmail(student)) {
            return;
        }

        String subject = "Thông báo từ chối đăng ký phòng nội trú";

        String content = String.format(
                """
                Chào %s,

                Rất tiếc, đăng ký phòng nội trú của bạn đã bị từ chối.

                Thông tin đăng ký:
                - Phòng đăng ký: %s
                - Thời gian lưu trú dự kiến: %s đến %s

                Lý do từ chối:
                %s

                Bạn có thể đăng nhập vào hệ thống để kiểm tra thông tin và thực hiện đăng ký phòng khác khi đủ điều kiện.

                Trân trọng,
                Ban Quản lý Ký túc xá STU
                """,
                getStudentName(student),
                getRoomName(contract),
                formatDate(contract.getStartDate()),
                formatDate(contract.getEndDate()),
                normalizeReason(reason)
        );

        sendMail(student.getEmail(), subject, content);
    }

    @Async
    public void sendCancelContract(Contract contract, String reason) {

        if (contract == null || contract.getStudent() == null) {
            return;
        }

        Student student = contract.getStudent();

        if (!hasValidEmail(student)) {
            return;
        }

        String subject = "Thông báo hủy hợp đồng nội trú";

        String content = String.format(
                """
                Chào %s,

                Ban Quản lý Ký túc xá thông báo hợp đồng nội trú của bạn đã được hủy.

                Thông tin hợp đồng:
                - Phòng: %s
                - Ngày bắt đầu: %s
                - Ngày kết thúc: %s
                - Trạng thái: Đã hủy

                Lý do hủy:
                %s

                Vui lòng đăng nhập vào hệ thống để kiểm tra thông tin chi tiết.

                Trân trọng,
                Ban Quản lý Ký túc xá STU
                """,
                getStudentName(student),
                getRoomName(contract),
                formatDate(contract.getStartDate()),
                formatDate(contract.getEndDate()),
                normalizeReason(reason)
        );

        sendMail(student.getEmail(), subject, content);
    }

    @Async
    public void sendReminderEmails(Invoice invoice) {

        if (invoice == null || invoice.getStudent() == null || !hasValidEmail(invoice.getStudent())) {
            return;
        }

        boolean isOverdue = invoice.getDueDate() != null && invoice.getDueDate().isBefore(LocalDate.now());

        String subject = isOverdue
                ? "Hóa đơn ký túc xá đã quá hạn"
                : "Nhắc nhở thanh toán hóa đơn ký túc xá";

        String paymentMessage = isOverdue
                ? "Hóa đơn đã quá hạn. Vui lòng thanh toán trong thời gian sớm nhất."
                : "Vui lòng thanh toán hóa đơn trước thời hạn quy định.";

        String content = String.format(
                """
                Chào %s,

                Bạn đang có hóa đơn ký túc xá chưa thanh toán.

                Thông tin hóa đơn:
                - Tháng: %s
                - Phòng: %s
                - Tổng tiền: %s
                - Hạn thanh toán: %s
                - Trạng thái: Chưa thanh toán

                %s

                Vui lòng đăng nhập vào hệ thống để xem chi tiết và thực hiện thanh toán.

                Trân trọng,
                Ban Quản lý Ký túc xá STU
                """,
                getStudentName(invoice.getStudent()),
                invoice.getMonth() != null
                        ? invoice.getMonth()
                        : "Chưa cập nhật",
                getInvoiceRoomName(invoice),
                formatMoney(invoice.getTotalAmount()),
                formatDate(invoice.getDueDate()),
                paymentMessage
        );

        sendMail(invoice.getStudent().getEmail(), subject, content);
    }

    @Async
    @Transactional
    public void sendPaymentSuccessEmail(Integer invoiceId) {

        System.out.println("===== BẮT ĐẦU GỬI EMAIL THANH TOÁN =====");

        Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);

        if (invoice == null) {
            System.err.println("Không tìm thấy hóa đơn ID = " + invoiceId);
            return;
        }

        if (invoice.getStudent() == null || !hasValidEmail(invoice.getStudent())) {
            System.err.println("Không tìm thấy email sinh viên.");
            return;
        }

        File pdfFile = null;

        try {
            System.out.println("Email nhận: " + invoice.getStudent().getEmail());

            pdfFile = pdfInvoiceService.generateInvoicePdf(invoice);

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            helper.setTo(
                    invoice.getStudent()
                            .getEmail()
                            .trim()
            );

            helper.setSubject("Xác nhận thanh toán hóa đơn KTX tháng " + invoice.getMonth());

            String content = String.format(
                    """
                    Kính gửi %s,
    
                    Hệ thống đã ghi nhận thanh toán thành công hóa đơn ký túc xá.
    
                    Thông tin thanh toán:
                    - Tháng: %s
                    - Phòng: %s
                    - Tổng tiền: %s
                    - Trạng thái: Đã thanh toán
    
                    Biên lai thanh toán được đính kèm trong email này.
    
                    Vui lòng đăng nhập vào hệ thống để kiểm tra thông tin chi tiết.
    
                    Trân trọng,
                    Ban Quản lý Ký túc xá STU
                    """,

                    getStudentName(
                            invoice.getStudent()
                    ),

                    invoice.getMonth() != null
                            ? invoice.getMonth()
                            : "Chưa cập nhật",

                    getInvoiceRoomName(
                            invoice
                    ),

                    formatMoney(
                            invoice.getTotalAmount()
                    )
            );

            helper.setText(content, false);

            if (pdfFile != null && pdfFile.exists()) {

                helper.addAttachment(
                        "HoaDonKTX_"
                                + invoice.getMonth()
                                + ".pdf",
                        pdfFile
                );
            }

            mailSender.send(message);

            System.out.println("===== GỬI EMAIL THANH TOÁN THÀNH CÔNG =====");

        } catch (Exception exception) {

            System.err.println("===== LỖI GỬI EMAIL THANH TOÁN =====");

            System.err.println(exception.getMessage());

            exception.printStackTrace();

        } finally {
            deleteTemporaryFile(pdfFile);
        }
    }

    public void sendMail(String to, String subject, String text) {

        if (to == null || to.isBlank()) {
            System.err.println("Không thể gửi email vì địa chỉ email trống.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(to.trim());
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);

        } catch (Exception exception) {
            System.err.println("Lỗi gửi email đến " + to + ": " + exception.getMessage());
            exception.printStackTrace();
        }
    }

    private boolean hasValidEmail(Student student) {
        return student != null && student.getEmail() != null && !student.getEmail().isBlank();
    }

    private String getStudentName(Student student) {

        if (student == null || student.getFullName() == null || student.getFullName().isBlank()) {
            return "Sinh viên";
        }
        return student.getFullName().trim();
    }

    private String getStudentUsername(Student student) {

        if (student == null || student.getUsername() == null || student.getUsername().isBlank()) {
            return "Chưa cập nhật";
        }

        return student.getUsername().trim();
    }

    private String getRoomName(Contract contract) {

        if (contract == null ||
                        contract.getRoom() == null ||
                        contract.getRoom().getName() == null ||
                        contract.getRoom().getName().isBlank()
        ) {
            return "Chưa cập nhật";
        }

        return contract.getRoom().getName();
    }

    private String getInvoiceRoomName(Invoice invoice) {

        if (
                invoice == null ||
                        invoice.getRoom() == null ||
                        invoice.getRoom().getName() == null ||
                        invoice.getRoom().getName().isBlank()
        ) {
            return "Chưa cập nhật";
        }

        return invoice.getRoom().getName();
    }

    private String formatDate(LocalDate date) {

        if (date == null) {
            return "Chưa cập nhật";
        }

        return date.format(DATE_FORMATTER);
    }

    private String formatMoney(Double amount) {

        if (amount == null) {
            return "0 VNĐ";
        }

        return MONEY_FORMATTER.format(amount) + " VNĐ";
    }

    private String normalizeReason(String reason) {

        if (reason == null || reason.isBlank()) {
            return "Không có lý do cụ thể.";
        }

        return reason.trim();
    }

    private void deleteTemporaryFile(File file) {

        if (file != null && file.exists() && !file.delete()) {
            System.err.println("Không thể xóa file PDF tạm: " + file.getAbsolutePath());
        }
    }
}