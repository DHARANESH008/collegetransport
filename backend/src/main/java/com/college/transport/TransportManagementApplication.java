package com.college.transport;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class TransportManagementApplication {

    @PostConstruct
    public void init() {
        // Force Indian Standard Time (IST - UTC+5:30) for all dates and times across the system
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }

    public static void main(String[] args) {
        SpringApplication.run(TransportManagementApplication.class, args);
    }
}

