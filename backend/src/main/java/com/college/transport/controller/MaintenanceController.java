package com.college.transport.controller;

import com.college.transport.dto.ApiResponse;
import com.college.transport.entity.SystemCleanupLog;
import com.college.transport.repository.SystemCleanupLogRepository;
import com.college.transport.service.DataCleanupScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MaintenanceController {

    @Autowired
    private DataCleanupScheduler cleanupScheduler;

    @Autowired
    private SystemCleanupLogRepository systemCleanupLogRepository;

    @PostMapping("/cleanup-now")
    public ResponseEntity<ApiResponse<SystemCleanupLog>> triggerManualCleanup() {
        SystemCleanupLog log = cleanupScheduler.executeCleanup();
        return ResponseEntity.ok(ApiResponse.ok("3-Month database retention cleanup executed successfully", log));
    }

    @GetMapping("/cleanup-logs")
    public ResponseEntity<ApiResponse<List<SystemCleanupLog>>> getCleanupLogs() {
        List<SystemCleanupLog> logs = systemCleanupLogRepository.findAllByOrderByCleanupTimestampDesc();
        return ResponseEntity.ok(ApiResponse.ok("Cleanup audit logs retrieved", logs));
    }
}
