package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.Room;
import com.stu.edu.ktx_management.entity.RoomStatus;
import com.stu.edu.ktx_management.entity.TypeRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    boolean existsByName(String roomName);
    List<Room> findByNameContainingIgnoreCase(String roomName);
    List<Room> findByStatusAndType(RoomStatus status, TypeRoom type);
}
