package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.Role;
import com.stu.edu.ktx_management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByUsername(String username);
    Optional<Student> findByEmail(String email);

    List<Student> findByFullNameContainingIgnoreCase(String fullName);

    List<Student> findByClassNameContainingIgnoreCase(String className);

    List<Student> findByFullNameContainingIgnoreCaseAndClassNameContainingIgnoreCase(
            String fullName,
            String className
    );

    long countByRole(Role role);
}
