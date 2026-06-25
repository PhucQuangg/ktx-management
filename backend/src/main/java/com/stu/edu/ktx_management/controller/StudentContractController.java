package com.stu.edu.ktx_management.controller;


import com.stu.edu.ktx_management.entity.Contract;
import com.stu.edu.ktx_management.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/student/contracts")
public class StudentContractController {

    @Autowired
    private ContractService contractService;

    @PostMapping("/register/semester")
    public ResponseEntity<?> registerBySemester(
            @RequestParam Integer roomId) {

        try {

            Contract contract =
                    contractService.registerRoomBySemester(roomId);

            return ResponseEntity.ok(contract);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    @GetMapping("/my-contracts")
    public ResponseEntity<?> getMyContracts() {
        return ResponseEntity.ok(contractService.getContractsByStudentId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(contractService.getContractDetail(id));
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancel(@PathVariable Integer id,@RequestParam String reason) {
        return ResponseEntity.ok(contractService.cancelContract(id,reason));
    }
}

