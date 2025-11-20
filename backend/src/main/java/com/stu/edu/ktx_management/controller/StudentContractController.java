package com.stu.edu.ktx_management.controller;

import com.stu.edu.ktx_management.dto.ContractDTO;
import com.stu.edu.ktx_management.dto.StudentContractDTO;
import com.stu.edu.ktx_management.dto.mapper.StudentContractMapper;
import com.stu.edu.ktx_management.entity.Contract;
import com.stu.edu.ktx_management.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student/contracts")
public class StudentContractController {

    @Autowired
    private ContractService contractService;

    @PostMapping("/register/semester")
    public ResponseEntity<?> registerBySemester(@RequestParam Integer roomId){
        try {
            Contract contract = contractService.registerRoomBySemester(roomId);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/register/custom")
    public ResponseEntity<?> registerCustom(@RequestParam Integer roomId,
                                            @RequestParam String startDate,
                                            @RequestParam String endDate){
        try {
            Contract contract = contractService.registerRoomCustom(
                    roomId,
                    LocalDate.parse(startDate),
                    LocalDate.parse(endDate));
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/my-contracts")
    public ResponseEntity<?> getContractsByStudent() {
        try {
            List<StudentContractDTO> dtos = contractService.getContractsByStudentId()
                    .stream()
                    .map(StudentContractMapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelContract(@PathVariable Integer id) {
        try {
            Contract contract = contractService.cancelContract(id); // phương thức service
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContractById(@PathVariable Integer id) {
        try {
            ContractDTO dto = contractService.getContractDetail(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }



}
