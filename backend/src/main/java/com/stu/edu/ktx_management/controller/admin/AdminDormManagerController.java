package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.entity.ApprovalStatus;
import com.stu.edu.ktx_management.entity.Role;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/dorm")
public class AdminDormManagerController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingStudents() {
        List<Student> pending = studentService.getAllStudents().stream()
                .filter(s -> s.getRole() == Role.STUDENT && s.getApprovalStatus() == ApprovalStatus.PENDING)
                .collect(Collectors.toList());
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveStudent(@PathVariable Integer id) {
        try {
            Student approved = studentService.approveStudent(id);
            return ResponseEntity.ok("✅ Đã duyệt sinh viên: " + approved.getFullName());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectStudent(@PathVariable Integer id, @RequestParam String reason) {
        try {
            Student rejected = studentService.rejectStudent(id, reason);
            return ResponseEntity.ok("❌ Đã từ chối sinh viên: " + rejected.getFullName());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
