package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.entity.Room;
import com.stu.edu.ktx_management.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rooms")
public class AdminRoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping
    public List<Room> listRooms(){
        return roomService.getAllRoom();
    }
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room){
        Room savedRoom = roomService.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    @GetMapping("/search")
    public List<Room> searchRoom(@RequestParam(required = false) Integer id,@RequestParam(required = false) String name){
        return roomService.searchRooms(id, name);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Integer id){
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Xoá phòng thành công với id: "+id);
    }

//    @GetMapping("/edit/{id}")
//    public String editRoomForm(@PathVariable Integer id, Model model) {
//        model.addAttribute("room", roomService.getRoomById(id));
//        return "room/edit";
//    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Integer id, @RequestBody Room roomDetails) {
        Room updatedRoom = roomService.updateRoom(id, roomDetails);
        return ResponseEntity.ok(updatedRoom);
    }

}
