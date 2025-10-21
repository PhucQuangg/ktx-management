package com.stu.edu.ktx_management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "username",nullable = false,unique = true)
    private String username;
    @Column(name = "password",nullable = false)
    private String password;
    @Column(name = "full_name")
    private String fullName;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;
    private Date created_at = new Date();

}
