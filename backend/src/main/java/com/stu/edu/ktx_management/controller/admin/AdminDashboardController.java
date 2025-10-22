package com.stu.edu.ktx_management.controller.admin;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    @GetMapping
    public Object getDashboardData() {
        return Map.of(
                "totalStudents", 120,
                "totalRooms", 45,
                "revenue", 35000000
        );
    }
}