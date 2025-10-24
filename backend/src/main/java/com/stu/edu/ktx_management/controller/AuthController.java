package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.config.jwt.JwtUtil;
import com.stu.edu.ktx_management.dto.AuthRequestDTO;
import com.stu.edu.ktx_management.entity.PasswordResetToken;
import com.stu.edu.ktx_management.entity.Role;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.repository.PasswordResetTokenRepository;
import com.stu.edu.ktx_management.repository.StudentRepository;
import com.stu.edu.ktx_management.service.ForgotPasswordService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@Controller
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ==========================
    // Đăng ký
    // ==========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Student student) {
        if (studentRepository.findByUsername(student.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại!");
        }
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email đã được sử dụng!");
        }

        student.setPassword(passwordEncoder.encode(student.getPassword()));
        if (student.getRole() == null) {
            student.setRole(Role.STUDENT);
        }

        studentRepository.save(student);
        return ResponseEntity.ok("Đăng ký tài khoản thành công!");
    }

    // ==========================
    // Đăng nhập
    // ==========================
    @PostMapping("/login")
    @ResponseBody
    public Object login(@RequestBody AuthRequestDTO req, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Sai tên đăng nhập hoặc mật khẩu!");
        }

        Student student = studentRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        String role = student.getRole().name();
        String token = jwtUtil.generateToken(student.getUsername(), role);

        return Map.of(
                "token", token,
                "role", role
        );
    }

    // ==========================
    // Quên mật khẩu
    // ==========================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            forgotPasswordService.createPasswordResetToken(email);
            return ResponseEntity.ok("Đã gửi email đặt lại mật khẩu tới: " + email);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==========================
    // Kiểm tra token đặt lại mật khẩu
    // ==========================
    @GetMapping("/reset-password")
    public ResponseEntity<?> showResetPasswordPage(@RequestParam String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);

        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "status", "error",
                            "message", "Liên kết không hợp lệ hoặc đã hết hạn!"
                    ));
        }

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Token hợp lệ!",
                "token", token
        ));
    }

    // ==========================
    // Đặt lại mật khẩu
    // ==========================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            forgotPasswordService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Mật khẩu đã được cập nhật thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
