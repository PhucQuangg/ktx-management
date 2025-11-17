package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.dto.ContractDTO;
import com.stu.edu.ktx_management.dto.mapper.ContractMapper;
import com.stu.edu.ktx_management.entity.Contract;
import com.stu.edu.ktx_management.entity.Room;
import com.stu.edu.ktx_management.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/contracts")
public class AdminContractController {
    @Autowired
    private ContractService contractService;

    @GetMapping
    public ResponseEntity<?> getAllContract(){
        List<ContractDTO> dtos = contractService.getAllContract()
                .stream()
                .map(ContractMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveContract(@PathVariable Integer id){
        try {
           Contract contract = contractService.approveContract(id);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectContract(@PathVariable Integer id){
        try {
            Contract contract = contractService.rejectContract(id);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelContract(@PathVariable Integer id){
        try {
            Contract contract = contractService.cancelContract(id);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/expire")
    public ResponseEntity<?> expireContracts() {
        contractService.expireContracts();
        return ResponseEntity.ok("Đã cập nhật các hợp đồng hết hạn.");
    }
}
