package com.stu.edu.ktx_management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RevenueChartDTO {

    private String month;

    private Double revenue;
}