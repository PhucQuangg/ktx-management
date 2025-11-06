package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

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
    public void sendMail(String to, String subject, String text){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
