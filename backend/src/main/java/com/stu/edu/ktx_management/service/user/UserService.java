package com.stu.edu.ktx_management.service.user;

import com.stu.edu.ktx_management.entity.User;
import com.stu.edu.ktx_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser (User user){
        return userRepository.save(user);
    }

    public User register(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username){
        return userRepository.findByUsername(username);
    }
    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

}
