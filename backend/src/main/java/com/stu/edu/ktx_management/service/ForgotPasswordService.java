package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.entity.PasswordResetToken;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.repository.PasswordResetTokenRepository;
import com.stu.edu.ktx_management.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ForgotPasswordService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // Gửi email reset mật khẩu
    public void createPasswordResetToken(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại!"));

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setStudent(student);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:8081/reset-password?token=" + token;
        emailService.sendMail(
                student.getEmail(),
                "Reset mật khẩu tài khoản ký túc xá",
                "Nhấn vào link sau để reset mật khẩu (hạn 15 phút): " + resetLink
        );
    }

    // Xử lý khi người dùng nhập mật khẩu mới qua link reset
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ!"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token đã hết hạn!");
        }

        Student student = resetToken.getStudent();
        student.setPassword(passwordEncoder.encode(newPassword));
        studentRepository.save(student);

        tokenRepository.delete(resetToken);
    }

    // Đổi mật khẩu từ trang cá nhân
    public void updatePassword(String username, String oldPassword, String newPassword) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        if (!passwordEncoder.matches(oldPassword, student.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng!");
        }

        student.setPassword(passwordEncoder.encode(newPassword));
        studentRepository.save(student);
    }
}
