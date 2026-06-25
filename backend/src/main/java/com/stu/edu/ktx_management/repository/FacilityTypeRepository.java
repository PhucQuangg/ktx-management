package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.FacilityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacilityTypeRepository
        extends JpaRepository<FacilityType,Integer> {
    Optional<FacilityType> findByName(String name);
}