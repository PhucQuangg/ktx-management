package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.dto.RevenueChartDTO;
import com.stu.edu.ktx_management.entity.Invoice;
import com.stu.edu.ktx_management.entity.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    List<Invoice> findByStudentId(Integer studentId);
    Optional<Invoice> findByTxnRef(String txnRef);
    List<Invoice> findByStatus(InvoiceStatus status);

    List<Invoice> findByMonth(String month);

    boolean existsByContractIdAndMonth(Integer contractId, String month);
    Long countByStatus(InvoiceStatus status);


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

    @Query("""
SELECT COALESCE(SUM(i.totalAmount),0)
FROM Invoice i
WHERE i.status = com.stu.edu.ktx_management.entity.InvoiceStatus.PAID
""")
    Long getTotalRevenue();

    @Query("""
SELECT COUNT(i)
FROM Invoice i
WHERE i.status = com.stu.edu.ktx_management.entity.InvoiceStatus.PAID
""")
    Long countPaidInvoices();

    @Query("""
SELECT COUNT(i)
FROM Invoice i
WHERE i.status = com.stu.edu.ktx_management.entity.InvoiceStatus.UNPAID
""")
    Long countUnpaidInvoices();

    @Query("""
    SELECT COALESCE(SUM(i.totalAmount),0)
    FROM Invoice i
    WHERE i.status = com.stu.edu.ktx_management.entity.InvoiceStatus.UNPAID
    """)
    Long getTotalUnpaidAmount();

    @Query("""
            SELECT new com.stu.edu.ktx_management.dto.RevenueChartDTO(
            i.month,
            SUM(i.totalAmount)
    )
            FROM Invoice i
            WHERE i.status = com.stu.edu.ktx_management.entity.InvoiceStatus.PAID
            GROUP BY i.month
            ORDER BY i.month
            """)
List<RevenueChartDTO> getRevenueByMonth();


}

