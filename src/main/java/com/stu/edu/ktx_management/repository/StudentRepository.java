package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByUser(User user);
}
