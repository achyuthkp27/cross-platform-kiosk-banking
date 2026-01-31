package com.kiosk.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KioskBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(KioskBackendApplication.class, args);
	}

}
