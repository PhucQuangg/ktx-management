package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.ResidenceInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResidenceInfoRepository extends JpaRepository<ResidenceInfo, Integer> {
}