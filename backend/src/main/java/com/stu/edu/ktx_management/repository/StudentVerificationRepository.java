package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.StudentVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentVerificationRepository
        extends JpaRepository<StudentVerification, String> {
    Optional<StudentVerification> findByMssv(String mssv);

}