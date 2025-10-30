package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.dto.PasswordChangeRequest;
import com.stu.edu.ktx_management.dto.StudentProfileDTO;
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
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
public class StudentProfileController {

    @Autowired
    private StudentService studentService;
    @Autowired
    private ForgotPasswordService passwordService;

    // Student xem thông tin cá nhân
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentProfileDTO getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        return studentService.getStudentByUsername(username);
    }

    @PutMapping("/profile/update")
    @PreAuthorize("hasRole('STUDENT')")
    public Student updateMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                   @RequestBody StudentProfileDTO request) {
        String username = userDetails.getUsername();
        return studentService.updateMyProfile(username, request);
    }
    @PutMapping("/change-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordChangeRequest req, Principal principal) {
        String username = principal.getName();
        passwordService.updatePassword(username, req.getOldPassword(), req.getNewPassword());
        return ResponseEntity.ok("Cập nhật mật khẩu thành công");
    }


}
