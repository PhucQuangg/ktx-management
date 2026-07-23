package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, Integer> {

    List<Notification> findByPublishedTrueOrderByCreatedAtDesc();

}
