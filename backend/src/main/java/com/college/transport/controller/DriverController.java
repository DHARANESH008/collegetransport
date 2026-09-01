package com.college.transport.controller;

import com.college.transport.dto.*;
import com.college.transport.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
@PreAuthorize("hasAnyAuthority('ROLE_DRIVER', 'ROLE_ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DriverController {

    @Autowired
    private DriverService driverService;

    // Login: Assigned Bus automatically loads with route and auto-computed Start KM
    @GetMapping("/bus-info")
    public ResponseEntity<ApiResponse<DriverBusInfoResponse>> getDriverBusInfo(Authentication auth) {
        DriverBusInfoResponse info = driverService.getDriverBusInfo(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Driver bus details loaded", info));
    }

    // Start Journey: Driver presses Start Journey (Date & Start Time automatically stored)
    @PostMapping("/start-journey")
    public ResponseEntity<ApiResponse<DriverBusInfoResponse>> startJourney(
            Authentication auth,
            @RequestBody(required = false) StartJourneyRequest request) {
        Double manualStartKm = request != null ? request.getManualStartKm() : null;
        DriverBusInfoResponse res = driverService.startJourney(auth.getName(), manualStartKm);
        return ResponseEntity.ok(ApiResponse.ok("Journey started successfully", res));
    }

    // College Arrival: Driver enters Student Count and presses Save
    @PostMapping("/save-students")
    public ResponseEntity<ApiResponse<DriverBusInfoResponse>> saveStudentCount(
            Authentication auth,
            @Valid @RequestBody SaveStudentsRequest request) {
        DriverBusInfoResponse res = driverService.saveStudentCount(auth.getName(), request.getStudentCount());
        return ResponseEntity.ok(ApiResponse.ok("Student count saved successfully", res));
    }

    // End Journey: Driver enters End KM, presses End Journey (stores End Time, calculates Distance = End KM - Start KM)
    @PostMapping("/end-journey")
    public ResponseEntity<ApiResponse<DriverBusInfoResponse>> endJourney(
            Authentication auth,
            @Valid @RequestBody EndJourneyRequest request) {
        DriverBusInfoResponse res = driverService.endJourney(auth.getName(), request.getEndKm());
        return ResponseEntity.ok(ApiResponse.ok("Journey ended successfully. Total Distance: " + res.getTotalDistance() + " KM", res));
    }

    // Trip History: Permanent trip log for driver
    @GetMapping("/trip-history")
    public ResponseEntity<ApiResponse<List<TripHistoryDTO>>> getDriverTripHistory(Authentication auth) {
        List<TripHistoryDTO> history = driverService.getDriverTripHistory(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Trip history loaded", history));
    }
}
