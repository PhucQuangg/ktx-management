package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.dto.NotificationDTO;
import com.stu.edu.ktx_management.entity.Notification;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.repository.NotificationRepository;
import com.stu.edu.ktx_management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;


    public NotificationDTO create(NotificationDTO dto) {

        Notification notification = new Notification();

        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notification.setPublished(dto.getPublished());
        notification.setCreatedAt(LocalDateTime.now());

        notification = notificationRepository.save(notification);

        return new NotificationDTO(
                notification.getId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getPublished(),
                notification.getCreatedAt());
    }
    public List<NotificationDTO> getAll() {

        return notificationRepository.findAll()
                .stream()
                .map(n -> new NotificationDTO(
                        n.getId(),
                        n.getTitle(),
                        n.getContent(),
                        n.getPublished(),
                        n.getCreatedAt()))
                .toList();
    }
    public void delete(Integer id) {
        notificationRepository.deleteById(id);
    }
    public NotificationDTO togglePublish(Integer id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Không tìm thấy thông báo"));

        notification.setPublished(
                !notification.getPublished()
        );

        notification = notificationRepository.save(notification);

        return new NotificationDTO(
                notification.getId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getPublished(),
                notification.getCreatedAt()
        );
    }
    public NotificationDTO update(
            Integer id,
            NotificationDTO dto
    ) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Không tìm thấy thông báo"));

        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notification.setPublished(dto.getPublished());

        notification = notificationRepository.save(notification);

        return new NotificationDTO(
                notification.getId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getPublished(),
                notification.getCreatedAt()
        );
    }

    public List<NotificationDTO> getPublishedNotifications() {

        return notificationRepository
                .findByPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(n -> new NotificationDTO(
                        n.getId(),
                        n.getTitle(),
                        n.getContent(),
                        n.getPublished(),
                        n.getCreatedAt()))
                .toList();
    }

}