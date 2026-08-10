package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.entity.SemesterRegistration;
import com.stu.edu.ktx_management.service.SemesterRegistrationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/semester-registration")
@RequiredArgsConstructor
public class AdminSemesterRegistrationController {

    private final SemesterRegistrationService semesterRegistrationService;

    @GetMapping
    public ResponseEntity<List<SemesterRegistration>> getAll() {
        return ResponseEntity.ok(semesterRegistrationService.getAll());
    }

    @GetMapping("/active")
    public ResponseEntity<SemesterRegistration> getActiveSemester() {

        SemesterRegistration semester = semesterRegistrationService.getActiveSemester();

        if (semester == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(semester);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateRegistrationTime(@PathVariable Integer id, @RequestBody SemesterRegistration request) {

        SemesterRegistration semester = semesterRegistrationService.updateRegistrationTime(id, request);

        return ResponseEntity.ok("Cập nhật thời gian đăng ký cho " + semester.getName() + " thành công.");
    }

    @PutMapping("/open/{id}")
    public ResponseEntity<String> openRegistration(@PathVariable Integer id) {
        SemesterRegistration semester = semesterRegistrationService.openRegistration(id);
        return ResponseEntity.ok("Đã mở đăng ký phòng cho " + semester.getName() + "."
        );
    }

    @PutMapping("/close/{id}")
    public ResponseEntity<String> closeRegistration(@PathVariable Integer id) {
        SemesterRegistration semester = semesterRegistrationService.closeRegistration(id);
        return ResponseEntity.ok("Đã đóng đăng ký phòng cho " + semester.getName() + ".");
    }
}