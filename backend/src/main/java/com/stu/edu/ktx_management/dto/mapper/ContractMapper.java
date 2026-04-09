package com.stu.edu.ktx_management.dto.mapper;

import com.stu.edu.ktx_management.dto.ContractDTO;
import com.stu.edu.ktx_management.dto.StudentContractDTO;
import com.stu.edu.ktx_management.entity.Contract;

public class ContractMapper {

    public static StudentContractDTO toStudentDTO(Contract c) {
        return new StudentContractDTO(
                c.getId(),
                c.getRoom().getName(),
                c.getStartDate(),
                c.getEndDate(),
                c.getStatus().name()
        );
    }

    public static ContractDTO toDetailDTO(Contract c) {
        return new ContractDTO(
                c.getId(),
                c.getStudent().getFullName(),
                c.getStudent().getUsername(),
                c.getStudent().getEmail(),
                c.getRoom().getName(),
                c.getStartDate(),
                c.getEndDate(),
                c.getStatus().name()
        );
    }


    public static ContractDTO toDTO(Contract c) {
        return new ContractDTO(
                c.getId(),
                c.getStudent() != null ? c.getStudent().getFullName() : null,
                c.getStudent() != null ? c.getStudent().getUsername() : null,
                c.getStudent() != null ? c.getStudent().getEmail() : null,
                c.getRoom() != null ? c.getRoom().getName() : null,
                c.getStartDate(),
                c.getEndDate(),
                c.getStatus() != null ? c.getStatus().name() : null
        );
    }
}
