package com.college.transport;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TransportManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(TransportManagementApplication.class, args);
    }
}
