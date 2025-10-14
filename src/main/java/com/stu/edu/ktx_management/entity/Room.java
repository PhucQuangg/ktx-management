package com.stu.edu.ktx_management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "room_name", nullable = false)
    private String name;
    @Column(name = "capacity", nullable = false)
    private Integer capacity;
    @Column(name = "current_occupancy", columnDefinition = "0")
    private Integer current_people;
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RoomStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TypeRoom type;
}
