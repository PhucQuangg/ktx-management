package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.SemesterRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemesterRegistrationRepository
        extends JpaRepository<SemesterRegistration, Integer> {

    List<SemesterRegistration> findByActiveTrue();
}
