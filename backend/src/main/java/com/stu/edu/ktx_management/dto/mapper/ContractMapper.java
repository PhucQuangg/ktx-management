package com.stu.edu.ktx_management.dto.mapper;

import com.stu.edu.ktx_management.dto.ContractDTO;
import com.stu.edu.ktx_management.entity.Contract;

public class ContractMapper {
    public static ContractDTO toDTO(Contract c) {
        if (c == null) return null;

        return new ContractDTO(
                c.getId(),
                c.getStudent() != null ? c.getStudent().getId() : null,
                c.getStudent() != null ? c.getStudent().getFullName() : null,
                c.getStudent() != null ? c.getStudent().getEmail() : null,
                c.getRoom() != null ? c.getRoom().getName() : null,
                c.getStartDate(),
                c.getEndDate(),
                c.getStatus() != null ? c.getStatus().name() : null
        );
    }
}
