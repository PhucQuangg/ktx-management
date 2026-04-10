package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.entity.*;
import com.stu.edu.ktx_management.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Async
    public void sendApprovalEmail(Student student) {
        String subject = "Thông báo duyệt hồ sơ nội trú";
        String content = String.format(
                "Chào %s,\n\nHồ sơ nội trú của bạn đã được duyệt!\n\n" +
                        "Tài khoản đăng nhập: %s\nMật khẩu mặc định: 12345678\n" +
                        "Vui lòng đăng nhập và đổi mật khẩu sau khi truy cập hệ thống.\n\nTrân trọng,\nBan quản lý KTX",
                student.getFullName(), student.getUsername()
        );

        sendMail(student.getEmail(), subject, content);
    }

    @Async
    public void sendRejectionEmail(Student student, String reason) {
        String subject = "Thông báo từ chối hồ sơ nội trú";
        String content = String.format(
                "Chào %s,\n\nRất tiếc, hồ sơ nội trú của bạn đã bị từ chối.\nLý do: %s\n\nTrân trọng,\nBan quản lý KTX",
                student.getFullName(), reason
        );

        sendMail(student.getEmail(), subject, content);
    }

    @Async
    public void sendCreatedEmail(Student student){
        String subject = "Thông báo tạo thành công hồ sơ nội trú";
        String content = String.format(
                "Chào %s,\n\nHồ sơ nội trú của bạn đã được tạo thành công!\n\n" +
                        "Tài khoản đăng nhập: %s\nMật khẩu mặc định: 12345678\n" +
                        "Vui lòng đăng nhập và đổi mật khẩu sau khi truy cập hệ thống.\n\nTrân trọng,\nBan quản lý KTX",
                student.getFullName(), student.getUsername()
        );

        sendMail(student.getEmail(), subject, content);
    }
    @Async
    public void sendRejectionContract(Contract contract, String reason) {
        Student student= contract.getStudent();
        String subject = "Thông báo từ chối hợp đồng đăng ký nội trú";
        String content = String.format(
                "Chào %s,\n\nRất tiếc, hợp đồng đăng ký nội trú của bạn đã bị từ chối.\nLý do: %s\n\nTrân trọng,\nBan quản lý KTX",
                student.getFullName(), reason
        );

        sendMail(student.getEmail(), subject, content);
    }

    @Async
    public void sendReminderEmails(Invoice invoice) {

            boolean isOverdue = invoice.getDueDate().isBefore(LocalDate.now());

            String subject = isOverdue
                    ? "⚠️ Hóa đơn lưu trú quá hạn "
                    : "📢 Nhắc nhở thanh toán hóa đơn lưu trú";

            String content =
                    "Xin chào " + invoice.getStudent().getFullName() + ",\n\n" +
                            "Bạn có hóa đơn tháng " + invoice.getMonth() + "\n" +
                            "Phòng: " + invoice.getRoom().getName() + "\n" +
                            "Tổng tiền: " + invoice.getTotalAmount() + " VND\n" +
                            "Hạn thanh toán: " + invoice.getDueDate() + "\n\n" +
                            (isOverdue
                                    ? "⚠️ Hóa đơn đã QUÁ HẠN, vui lòng thanh toán ngay!"
                                    : "Vui lòng thanh toán đúng hạn.") +
                            "\n\nTrân trọng,\nBan quản lý KTX";

            sendMail(invoice.getStudent().getEmail(), subject, content);
    }


    @Async
    public void sendCancelContract(Contract contract, String reason) {
        Student student= contract.getStudent();
        String subject = "Thông báo hủy hợp đồng đăng ký nội trú";
        String content = String.format(
                "Chào %s,\n\nRất tiếc, hợp đồng đăng ký nội trú của bạn đã bị hủy.\nLý do: %s\n\nTrân trọng,\nBan quản lý KTX",
                student.getFullName(), reason
        );

        sendMail(student.getEmail(), subject, content);
    }




    @Async
    public void sendMail(String to, String subject, String text){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
