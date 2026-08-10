package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Integer> {

}