package com.stu.edu.ktx_management.dto;

import com.stu.edu.ktx_management.entity.Services;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDTO {

    private Integer id;
    private String name;
    private Double price;

    public ServiceDTO(Services service){
        this.id = service.getId();
        this.name = service.getName();
        this.price = service.getPrice();
    }

}