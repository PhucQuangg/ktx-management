package com.stu.edu.frontend_admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminViewController {
    @GetMapping("/")
    public String dashboard() {
        return "admin/dashboard";
    }
    @GetMapping("/admin/student")
    public String ListStudent() {
        return "admin/Student/listStudent";
    }
    @GetMapping("/admin/rooms")
    public String ListRoom() {
        return "admin/Room/listRoom";
    }
    @GetMapping("/admin/add-room")
    public String addRoom() {
        return "admin/Room/addRoom";
    }
    @GetMapping("/admin/update-room")
    public String updateRoom() {
        return "admin/Room/updateRoom";
    }
    @GetMapping("/admin/dorm")
    public String ListDorm() {
        return "admin/Dorm/listDorm";
    }

}
