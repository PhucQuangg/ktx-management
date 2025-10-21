package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
