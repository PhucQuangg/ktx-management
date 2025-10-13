package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.entity.PasswordResetToken;
import com.stu.edu.ktx_management.entity.User;
import com.stu.edu.ktx_management.repository.PasswordResetTokenRepository;
import com.stu.edu.ktx_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ForgotPasswordService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public void createPasswordResetToken(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("Email không tồn tại !"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:8080/api/auth/reset-password?token=" + token;
        emailService.sendMail(
                user.getEmail(),
                "Reset mật khẩu tài khoản ký túc xá",
                "Nhấn vào link sau để reset mật khẩu (hạn 15 phút): " + resetLink
        );
    }

    public void resetPassword(String token, String newPassword){
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(()-> new RuntimeException("Token không hợp lệ"));

        if(resetToken.getExpiryDate().isBefore(LocalDateTime.now()))
                throw new RuntimeException("Token đã hết hạn");

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }

    public void updatePassword (String username, String oldPassword, String newPassword){
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("Không tìm thấy user"));
        if(!passwordEncoder.matches(oldPassword, user.getPassword())){
            throw new RuntimeException("Mật khẩu cũ không đúng !");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}
