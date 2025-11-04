package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.dto.StudentContractDTO;
import com.stu.edu.ktx_management.dto.mapper.StudentContractMapper;
import com.stu.edu.ktx_management.entity.Contract;
import com.stu.edu.ktx_management.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student/contracts")
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
public class StudentContractController {
    @Autowired
    private ContractService contractService;

    @PostMapping("/register/semester")
    public ResponseEntity<?> registerBySemester(@RequestParam Integer roomId){
        Contract contract = contractService.registerRoomBySemester(roomId);
        return ResponseEntity.ok(contract);
    }

    @PostMapping("/register/custom")
    public ResponseEntity<?> registerCustom(@RequestParam Integer roomId, @RequestParam String startDate, @RequestParam String endDate){
        Contract contract = contractService.registerRoomCustom(
                roomId,
                LocalDate.parse(startDate),
                LocalDate.parse(endDate));
        return ResponseEntity.ok(contract);
    }

    @GetMapping("/my-contracts")
    public ResponseEntity<?> getContractsByStudent() {
        List<StudentContractDTO> dtos = contractService.getContractsByStudentId()
                .stream()
                .map(StudentContractMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
