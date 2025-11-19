package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.entity.Room;
import com.stu.edu.ktx_management.entity.TypeRoom;
import com.stu.edu.ktx_management.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/rooms")
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

    @GetMapping("/{id}")
    public Room getRoom(@PathVariable("id") Integer id) {
        return roomService.getRoomById(id);
    }
}
