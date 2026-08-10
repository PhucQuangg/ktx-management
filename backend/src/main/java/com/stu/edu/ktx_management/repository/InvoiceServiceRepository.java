package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.InvoiceServices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceServiceRepository extends JpaRepository<InvoiceServices, Integer> {

}