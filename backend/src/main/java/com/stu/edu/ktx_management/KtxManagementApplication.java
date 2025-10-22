package com.stu.edu.ktx_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication

public class KtxManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(KtxManagementApplication.class, args);
	}

}
