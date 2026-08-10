package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.dto.ContractDTO;
import com.stu.edu.ktx_management.dto.StudentDTO;
import com.stu.edu.ktx_management.dto.mapper.ContractMapper;
import com.stu.edu.ktx_management.entity.Contract;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/contracts")
public class AdminContractController {

    @Autowired
    private ContractService contractService;

    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getStudentsInRoom(@PathVariable Integer roomId) {
        try {
            List<StudentDTO> students = contractService.getStudentsInRoom(roomId);
            return ResponseEntity.ok(students);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllContract() {
        try {
            List<ContractDTO> dtos = contractService.getAllContract()
                    .stream()
                    .map(ContractMapper::toDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getContractById(@PathVariable Integer id) {
        return ResponseEntity.ok(contractService.getContractById(id));
    }


    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveContract(@PathVariable Integer id) {
        try {
            contractService.approveContract(id);
            return ResponseEntity.ok("Duyệt hợp đồng thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectContract(@PathVariable Integer id,  @RequestParam String reason) {
        try {
            contractService.rejectContract(id, reason);
            return ResponseEntity.ok("Từ chối đơn đăng ký thành công! ");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelContract(@PathVariable Integer id,@RequestParam String reason) {
        try {
            contractService.cancelContract(id,reason);
            return ResponseEntity.ok(("Hủy hợp đồng nội trú thành công! ") );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PutMapping("/expire")
    public ResponseEntity<?> expireContracts() {
        try {
            contractService.expireContracts();
            return ResponseEntity.ok("Đã cập nhật các hợp đồng hết hạn");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
