package com.stu.edu.ktx_management.controller.admin;
import com.stu.edu.ktx_management.dto.ServiceDTO;
import com.stu.edu.ktx_management.entity.Services;
import com.stu.edu.ktx_management.service.ServicesService;
import lombok.RequiredArgsConstructor;
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
    public Services update(@PathVariable Integer id, @RequestBody ServiceDTO dto){
        return servicesService.update(id,dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){
        servicesService.delete(id);
    }
}
