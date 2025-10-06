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

    @GetMapping
    public String homePage() {
        return "index";
    }
}
