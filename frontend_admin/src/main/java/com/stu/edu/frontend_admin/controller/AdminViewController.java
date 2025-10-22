package com.stu.edu.frontend_admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AdminViewController {
    @GetMapping("/admin/dashboard")
    public String dashboard(@RequestParam(required = false) String token) {
        if (token == null || token.isEmpty()) {
            return "redirect:http://localhost:8081/login";
        }
        return "admin/dashboard";
    }
}
