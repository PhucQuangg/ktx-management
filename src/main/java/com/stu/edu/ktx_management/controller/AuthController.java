package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.config.jwt.JwtUtil;
import com.stu.edu.ktx_management.entity.Role;
import com.stu.edu.ktx_management.entity.User;
import com.stu.edu.ktx_management.repository.UserRepository;
import com.stu.edu.ktx_management.service.ForgotPasswordService;
import com.stu.edu.ktx_management.service.user.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("api/auth")
public class AuthController {
    @Autowired private UserService userService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserDetailsService userDetailsService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private ForgotPasswordService forgotPasswordService;

    // Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userService.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Email already exists");
        }
        user.setUsername(user.getUsername());
        user.setEmail(user.getEmail());
        user.setFullName(user.getFullName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.STUDENT);
        userService.createUser(user);
        return ResponseEntity.ok("User registered");
    }

    // Login -> trả JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        UserDetails ud = userDetailsService.loadUserByUsername(req.getUsername());
        String token = jwtUtil.generateToken(ud.getUsername());
        User user = userService.findByUsername(req.getUsername()).orElseThrow();
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email){
        forgotPasswordService.createPasswordResetToken(email);
        return ResponseEntity.ok("Email reset password đã được gửi tới: " +email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword){
        forgotPasswordService.resetPassword(token,newPassword);
        return ResponseEntity.ok("Mật khẩu đã được cập nhật thành công!");
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthRequest {
        private String username;
        private String password;
    }

    @Data @AllArgsConstructor
    public static class AuthResponse {
        private String jwt;
        private String role;
    }
}
