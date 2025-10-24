package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + student.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                student.getUsername(),
                student.getPassword(), // password đã mã hóa
                Collections.singletonList(authority) // danh sách authorities
        );
    }
}
