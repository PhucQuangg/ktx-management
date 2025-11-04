package com.stu.edu.ktx_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableAsync
@SpringBootApplication
@EnableScheduling
public class KtxManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(KtxManagementApplication.class, args);
	}

}
