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
    private String username;
    private String password;
    @Column(name = "full_name")
    private String fullName;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;
    private Date created_at;

}
