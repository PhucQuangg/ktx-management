package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.dto.StudentProfileDTO;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.service.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Student createStudent(@RequestBody Student student) {
        return studentService.createStudent(student);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Student updateStudent(@PathVariable Integer id, @RequestBody Student student) {
        return studentService.updateStudent(id, student);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable Integer id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
