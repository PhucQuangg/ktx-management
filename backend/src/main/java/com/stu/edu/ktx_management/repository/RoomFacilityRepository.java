package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.RoomFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomFacilityRepository
        extends JpaRepository<RoomFacility,Integer> {
}
