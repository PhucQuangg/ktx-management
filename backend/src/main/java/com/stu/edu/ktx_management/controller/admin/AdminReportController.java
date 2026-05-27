package com.stu.edu.ktx_management.controller.admin;

import com.stu.edu.ktx_management.dto.DashboardDTO;
import com.stu.edu.ktx_management.dto.FinancialDTO;
import com.stu.edu.ktx_management.dto.RevenueChartDTO;
import com.stu.edu.ktx_management.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/dashboard")
    public DashboardDTO dashboard() {
        return reportService.getDashboard();
    }
    @GetMapping("/revenue-chart")
    public List<RevenueChartDTO> revenueChart() {
        return reportService.getRevenueChart();

    }
    @GetMapping("/financial")
    public FinancialDTO getFinancial() {
        return reportService.getFinancial();
    }
}