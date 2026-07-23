package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.dto.NotificationDTO;
import com.stu.edu.ktx_management.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
 public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/admin/notifications")
    public ResponseEntity<?> create(
            @RequestBody NotificationDTO dto
    ) {
        try {
            return ResponseEntity.ok(
                    notificationService.create(dto)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/admin/notifications")
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(
                    notificationService.getAll()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Integer id
    ) {
        try {
            notificationService.delete(id);
            return ResponseEntity.ok("Xóa thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    @PutMapping("/{id}/publish")
    public ResponseEntity<?> publish(
            @PathVariable Integer id
    ) {
        try {
            return ResponseEntity.ok(
                    notificationService.togglePublish(id)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    @PutMapping("/admin/notifications/{id}")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody NotificationDTO dto
    ) {
        try {
            return ResponseEntity.ok(
                    notificationService.update(id, dto)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/student/notifications")
    public ResponseEntity<?> getStudentNotifications() {

        return ResponseEntity.ok(
                notificationService.getPublishedNotifications()
        );
    }
}
