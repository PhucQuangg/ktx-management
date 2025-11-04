package com.stu.edu.ktx_management.dto.mapper;

import com.stu.edu.ktx_management.dto.StudentContractDTO;
import com.stu.edu.ktx_management.entity.Contract;

public class StudentContractMapper {
    public static StudentContractDTO toDTO(Contract c) {
        if (c == null) return null;

        return new StudentContractDTO(
                c.getId(),
                c.getRoom() != null ? c.getRoom().getName() : null,
                c.getStartDate(),
                c.getEndDate(),
                c.getStatus() != null ? c.getStatus().name() : null,
                c.getRoom() != null ? c.getRoom().getPrice() : null
        );
    }
}
