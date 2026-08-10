package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.dto.NotificationDTO;
import com.stu.edu.ktx_management.entity.Notification;
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
            notificationService.create(dto);
            return ResponseEntity.ok(
                    "Thêm thông báo thành công!"
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/admin/notifications")
    public ResponseEntity<?> getAll() {
        try {
            notificationService.getAll();
            return ResponseEntity.ok(
                    notificationService.getAll()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    @DeleteMapping("/admin/notifications/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Integer id
    ) {
        try {
            notificationService.delete(id);
            return ResponseEntity.ok("Xóa thông báo thành công! ");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    @PutMapping("/admin/notifications/{id}/publish")
    public ResponseEntity<?> publish(
            @PathVariable Integer id
    ) {
        try {

            Notification notification =
                    notificationService.togglePublish(id);

            String message = notification.getPublished()
                    ? "Đăng thông báo thành công!"
                    : "Ẩn thông báo thành công!";

            return ResponseEntity.ok(message);

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
            notificationService.update(id, dto);
            return ResponseEntity.ok(
                    "Cập nhật thông báo thành công!"
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
