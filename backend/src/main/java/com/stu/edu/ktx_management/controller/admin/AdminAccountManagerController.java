package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.dto.ProfileDTO;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/accounts")
public class AdminAccountManagerController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/all")
    public ResponseEntity<List<ProfileDTO>> getAllStudents() {

        return ResponseEntity.ok(
                studentService.getAllStudents()
        );

    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveStudent(@PathVariable Integer id) {
        try {
            Student approved = studentService.approveStudent(id);
            return ResponseEntity.ok("Duyệt sinh viên thành công! ");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectStudent(@PathVariable Integer id, @RequestParam String reason) {
        try {
            studentService.rejectStudent(id, reason);
            return ResponseEntity.ok("Từ chối sinh viên thành công! " );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
