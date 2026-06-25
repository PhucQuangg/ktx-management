package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.dto.RoomFacilityDTO;
import com.stu.edu.ktx_management.entity.RoomFacility;
import com.stu.edu.ktx_management.service.RoomFacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/facilities")
public class AdminRoomFacilityController {

    @Autowired
    private RoomFacilityService roomFacilityService;

    @GetMapping
    public List<RoomFacilityDTO> getAll() {
        return roomFacilityService.getAll();
    }

    @PostMapping
    public ResponseEntity<?> add(
            @RequestBody RoomFacilityDTO dto
    ) {
        try {

            RoomFacility facility =
                    roomFacilityService.create(dto);

            return ResponseEntity.ok(
                    "Thêm cơ sở vật chất thành công!"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body("Có lỗi xảy ra!");

        }
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Integer id
    ) {
        roomFacilityService.delete(id);
    }

    @GetMapping("/{id}")
    public RoomFacilityDTO getById(
            @PathVariable Integer id
    ) {
        return roomFacilityService.getById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody RoomFacilityDTO dto
    ) {
        try {

            RoomFacility facility =
                    roomFacilityService.update(id,dto);

            return ResponseEntity.ok(
                    "Cập nhật cơ sở vật chất thành công!"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body("Có lỗi xảy ra!");

        }
    }
}