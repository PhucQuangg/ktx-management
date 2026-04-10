package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.Invoice;
import com.stu.edu.ktx_management.entity.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    List<Invoice> findByStudentId(Integer studentId);

    List<Invoice> findByStatus(InvoiceStatus status);

    List<Invoice> findByMonth(String month);

    boolean existsByContractIdAndMonth(Integer contractId, String month);

    @Query("""
    SELECT i FROM Invoice i
    JOIN FETCH i.contract c
    JOIN FETCH i.room r
    JOIN FETCH i.student s
    WHERE (:status IS NULL OR i.status = :status)
    AND (:month IS NULL OR i.month = :month)
    AND (:roomName IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :roomName, '%')))
""")
    List<Invoice> filter(
            @Param("status") InvoiceStatus status,
            @Param("month") String month,
            @Param("roomName") String roomName
    );

    @Query("""
    SELECT i FROM Invoice i
    JOIN FETCH i.student
    JOIN FETCH i.room
    WHERE i.status = 'UNPAID'
""")
    List<Invoice> findUnpaidInvoices();




}

