package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.entity.Room;
import com.stu.edu.ktx_management.entity.TypeRoom;
import com.stu.edu.ktx_management.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/rooms")
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
public class StudentRoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/available-by-type")
    public List<Room> getRoomsByType(@RequestParam("type") String type) {
        TypeRoom roomType;
        try {
            roomType = TypeRoom.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Loại phòng không hợp lệ: " + type);
        }

        return roomService.getAvailableRoomsByType(roomType);
    }
}
