package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.dto.ServiceDTO;
import com.stu.edu.ktx_management.entity.Services;
import com.stu.edu.ktx_management.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicesService {

    private final ServiceRepository repository;

    public List<ServiceDTO> getAll(){

        return repository.findAll()
                .stream()
                .map(ServiceDTO::new)
                .toList();

    }

    public Services add(ServiceDTO dto){

        Services service = Services.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .build();

        return repository.save(service);

    }

    public Services update(Integer id, ServiceDTO dto){

        Services service = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

        service.setName(dto.getName());

        service.setPrice(dto.getPrice());

        return repository.save(service);

    }

    public void delete(Integer id){

        repository.deleteById(id);

    }

}