package com.stu.edu.ktx_management.service.user;

import com.stu.edu.ktx_management.entity.User;
import com.stu.edu.ktx_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + u.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(), // password đã mã hóa
                Collections.singletonList(authority) // danh sách authorities
        );
    }
}
