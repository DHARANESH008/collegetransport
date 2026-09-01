package com.college.transport.controller;

import com.college.transport.dto.ApiResponse;
import com.college.transport.dto.BusEntryRequest;
import com.college.transport.dto.BusEntryResponse;
import com.college.transport.dto.BusEntryUpdateDTO;
import com.college.transport.entity.Gate;
import com.college.transport.service.SecurityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/security")
@PreAuthorize("hasAnyAuthority('ROLE_SECURITY', 'ROLE_ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SecurityController {

    @Autowired
    private SecurityService securityService;

    // Security logs in: Gate loads automatically. Security name should NOT be displayed.
    @GetMapping("/gate-info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGateInfo(Authentication auth) {
        Gate gate = securityService.getAssignedGate(auth.getName());
        Map<String, Object> data = Map.of(
                "gateId", gate.getId(),
                "gateName", gate.getGateName(),
                "description", gate.getDescription() != null ? gate.getDescription() : ""
        );
        return ResponseEntity.ok(ApiResponse.ok("Assigned gate loaded", data));
    }

    // Bus Enter: Security selects only Bus Number (0-150), presses Bus Enter. System automatically stores Gate, Date, Time.
    @PostMapping("/bus-entry")
    public ResponseEntity<ApiResponse<BusEntryResponse>> recordBusEntry(
            Authentication auth,
            @Valid @RequestBody BusEntryRequest request) {
        BusEntryResponse res = securityService.recordBusEntry(auth.getName(), request.getBusNumber());
        return ResponseEntity.ok(ApiResponse.ok("Bus #" + res.getBusNumber() + " Entry recorded successfully at " + res.getGateName(), res));
    }

    // Edit: Security can edit Bus Number ONLY. Security cannot edit Entry Date or Entry Time.
    @PutMapping("/bus-entry/{id}")
    public ResponseEntity<ApiResponse<BusEntryResponse>> updateBusEntry(
            @PathVariable("id") Long id,
            @Valid @RequestBody BusEntryUpdateDTO request) {
        BusEntryResponse res = securityService.updateBusEntryNumber(id, request.getNewBusNumber());
        return ResponseEntity.ok(ApiResponse.ok("Bus Number updated successfully to #" + res.getBusNumber(), res));
    }

    @Autowired
    private com.college.transport.service.AdminService adminService;

    // Get buses list for selection dropdown (0-150)
    @GetMapping("/buses")
    public ResponseEntity<ApiResponse<List<com.college.transport.dto.BusDTO>>> getBuses() {
        List<com.college.transport.dto.BusDTO> buses = adminService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.ok("Buses loaded", buses));
    }

    // Today's entries table
    @GetMapping("/today-entries")
    public ResponseEntity<ApiResponse<List<BusEntryResponse>>> getTodayEntries() {
        List<BusEntryResponse> entries = securityService.getTodayEntries();
        return ResponseEntity.ok(ApiResponse.ok("Today's entries loaded", entries));
    }
}
