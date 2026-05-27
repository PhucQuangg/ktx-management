package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.dto.DashboardDTO;
import com.stu.edu.ktx_management.dto.FinancialDTO;
import com.stu.edu.ktx_management.dto.RevenueChartDTO;
import com.stu.edu.ktx_management.entity.*;
import com.stu.edu.ktx_management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public DashboardDTO getDashboard() {

        DashboardDTO dto = new DashboardDTO();

        dto.setTotalStudents(
                studentRepository.countByRole(Role.STUDENT)
        );

        dto.setTotalRooms(
                roomRepository.count()
        );

        dto.setAvailableRooms(
                roomRepository.countByStatus(RoomStatus.AVAILABLE)
        );

        dto.setTotalInvoices(
                invoiceRepository.count()
        );

        dto.setActiveContracts(
                contractRepository.countByStatus(ContractStatus.ACTIVE)
        );

        dto.setRevenue(
                invoiceRepository.getTotalRevenue()
        );
        dto.setPaidInvoices(
                invoiceRepository.countByStatus(InvoiceStatus.PAID)
        );
        dto.setUnpaidInvoices(
                invoiceRepository.countByStatus(InvoiceStatus.UNPAID)
        );

        dto.setUnpaidAmount(
                invoiceRepository.getTotalUnpaidAmount()
        );

        return dto;
    }

    public FinancialDTO getFinancial() {

        FinancialDTO dto = new FinancialDTO();

        dto.setTotalRevenue(
                invoiceRepository.getTotalRevenue()
        );

        dto.setPaidInvoices(
                invoiceRepository.countPaidInvoices()
        );

        dto.setUnpaidInvoices(
                invoiceRepository.countUnpaidInvoices()
        );

        dto.setUnpaidAmount(
                invoiceRepository.getTotalUnpaidAmount()
        );

        return dto;
    }
    public List<RevenueChartDTO> getRevenueChart() {
        return invoiceRepository.getRevenueByMonth();
    }
}