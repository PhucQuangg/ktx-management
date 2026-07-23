package com.stu.edu.ktx_management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Integer id;

    private String title;

    private String content;

    private Boolean published;

    private LocalDateTime createdAt;

}
