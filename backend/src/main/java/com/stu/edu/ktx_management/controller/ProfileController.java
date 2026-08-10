package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.dto.PasswordChangeRequest;
import com.stu.edu.ktx_management.dto.ProfileDTO;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.service.ForgotPasswordService;
import com.stu.edu.ktx_management.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class ProfileController {

    @Autowired
    private StudentService studentService;
    @Autowired
    private ForgotPasswordService passwordService;

    @GetMapping("/profile")
    public ProfileDTO getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        return studentService.getStudentByUsername(username);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                   @RequestBody ProfileDTO request) {
        String username = userDetails.getUsername();
        studentService.updateMyProfile(username, request);
        return ResponseEntity.ok("Cập nhật thông tin thành công!");
    }
    @PutMapping("/change-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordChangeRequest req, Principal principal) {
        String username = principal.getName();
        passwordService.updatePassword(username, req.getOldPassword(), req.getNewPassword());
        return ResponseEntity.ok("Cập nhật mật khẩu thành công!");
    }



}
