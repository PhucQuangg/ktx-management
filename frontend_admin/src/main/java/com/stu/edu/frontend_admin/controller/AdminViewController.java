package com.stu.edu.frontend_admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminViewController {
    @GetMapping("/admin/dashboard")
    public String dashboard() {
        return "admin/dashboard";
    }
    @GetMapping("/admin/student")
    public String ListStudent() {
        return "admin/Student/listStudent";
    }
    @GetMapping("/admin/rooms")
    public String ListUser() {
        return "admin/Room/listRoom";
    }

}
