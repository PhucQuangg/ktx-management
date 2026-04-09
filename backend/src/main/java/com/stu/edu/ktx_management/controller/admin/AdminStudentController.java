package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.dto.StudentDTO;
import com.stu.edu.ktx_management.entity.ApprovalStatus;
import com.stu.edu.ktx_management.entity.Role;
import com.stu.edu.ktx_management.entity.Room;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/students")
public class AdminStudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllStudents() {
        try {
            return ResponseEntity.ok(studentService.getAllStudents().stream()
            .filter(s -> s.getApprovalStatus() == ApprovalStatus.APPROVED)
            .filter(s -> s.getRole() == Role.STUDENT));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tải danh sách sinh viên: " + e.getMessage());
        }
    }
    @GetMapping("/edit/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Integer id) {
        try {
            Student student = studentService.getStudentById(id);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStudent(@RequestBody StudentDTO studentDTO) {
        try {
            Student savedStudent = studentService.createStudentByAdmin(studentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStudent(@PathVariable Integer id, @RequestBody Student student) {
        try {
            Student updatedStudent = studentService.updateStudent(id, student);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteStudent(@PathVariable Integer id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok("Xoá sinh viên thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
