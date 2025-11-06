package com.stu.edu.frontend_student.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class StudentViewController {

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/forgot-password")
    public String forgotpassword() {
        return "forgotPassword";
    }

    @GetMapping("/reset-password")
    public String resetpassword(@RequestParam(required = false) String token) {
        if (token == null || token.isEmpty()) {
            return "redirect:/login";
        }
        return "resetPassword";
    }

    @GetMapping("/profile")
    public String profile() {
        return "student/profile";
    }
    @GetMapping("/rooms")
    public String rooms() {
        return "student/rooms";
    }

    @GetMapping
    public String homePage() {
        return "student/index";
    }

    @GetMapping("/dorm-register")
    public String DormRegister() {
        return "registerDorm";
    }

}
