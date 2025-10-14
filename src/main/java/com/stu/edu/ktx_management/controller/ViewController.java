package com.stu.edu.ktx_management.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class ViewController {

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
    @GetMapping("/register")
    public String Register() {
        return "register";
    }
    @GetMapping("/forgot-password")
    public String forgotpassword() {
        return "forgotPassword";
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
}
