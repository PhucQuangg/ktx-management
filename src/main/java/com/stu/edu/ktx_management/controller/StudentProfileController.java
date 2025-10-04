package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.dto.StudentProfileDTO;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.service.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentProfileController {

    @Autowired
    private StudentService studentService;

    // Student xem thông tin cá nhân
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public Student getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        // Lấy username từ token
        String username = userDetails.getUsername();

        // Tìm student theo username trong user
        return studentService.getStudentByUsername(username);
    }

    // Student cập nhật thông tin cá nhân (trừ username, email)
    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public Student updateMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                   @RequestBody StudentProfileDTO request) {
        String username = userDetails.getUsername();
        return studentService.updateMyProfile(username, request);
    }
}
