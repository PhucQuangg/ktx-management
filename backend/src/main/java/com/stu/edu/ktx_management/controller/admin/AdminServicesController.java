package com.stu.edu.ktx_management.controller.admin;
import com.stu.edu.ktx_management.dto.ServiceDTO;
import com.stu.edu.ktx_management.entity.Services;
import com.stu.edu.ktx_management.service.ServicesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/services")
@RequiredArgsConstructor
public class AdminServicesController {

    private final ServicesService servicesService;

    @GetMapping
    public List<ServiceDTO> getAll(){
        return servicesService.getAll();
    }

    @PostMapping
    public Services add(@RequestBody ServiceDTO dto){
        return servicesService.add(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody ServiceDTO dto){
        servicesService.update(id,dto);
        return ResponseEntity.ok("Cập nhật dịch vụ thành công! ");
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){
        servicesService.delete(id);
    }
}
