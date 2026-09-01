package com.college.transport.controller;

import com.college.transport.dto.*;
import com.college.transport.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ---------------- Dashboard Analytics ----------------
    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics loaded", stats));
    }

    // ---------------- Real-time Bus Search (0-150) ----------------
    @GetMapping("/buses/search/{busNumber}")
    public ResponseEntity<ApiResponse<BusSearchResponse>> searchBus(@PathVariable("busNumber") Integer busNumber) {
        BusSearchResponse res = adminService.searchBus(busNumber);
        return ResponseEntity.ok(ApiResponse.ok("Bus details retrieved", res));
    }

    // ---------------- Master Buses Management ----------------
    @GetMapping("/buses")
    public ResponseEntity<ApiResponse<List<BusDTO>>> getAllBuses() {
        return ResponseEntity.ok(ApiResponse.ok("Buses loaded", adminService.getAllBuses()));
    }

    @GetMapping("/buses/{id}")
    public ResponseEntity<ApiResponse<BusDTO>> getBusById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Bus retrieved", adminService.getBusById(id)));
    }

    @PostMapping("/buses")
    public ResponseEntity<ApiResponse<BusDTO>> createBus(@Valid @RequestBody BusDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Bus created successfully", adminService.createBus(dto)));
    }

    @PutMapping("/buses/{id}")
    public ResponseEntity<ApiResponse<BusDTO>> updateBus(@PathVariable("id") Long id, @Valid @RequestBody BusDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Bus updated successfully", adminService.updateBus(id, dto)));
    }

    @DeleteMapping("/buses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable("id") Long id) {
        adminService.deleteBus(id);
        return ResponseEntity.ok(ApiResponse.ok("Bus deleted successfully"));
    }

    // ---------------- Master Drivers Management ----------------
    @GetMapping("/drivers")
    public ResponseEntity<ApiResponse<List<DriverDTO>>> getAllDrivers() {
        return ResponseEntity.ok(ApiResponse.ok("Drivers loaded", adminService.getAllDrivers()));
    }

    @PostMapping("/drivers")
    public ResponseEntity<ApiResponse<DriverDTO>> createDriver(@Valid @RequestBody DriverDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Driver account created successfully", adminService.createDriver(dto)));
    }

    @PutMapping("/drivers/{id}")
    public ResponseEntity<ApiResponse<DriverDTO>> updateDriver(@PathVariable("id") Long id, @Valid @RequestBody DriverDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Driver account updated successfully", adminService.updateDriver(id, dto)));
    }

    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDriver(@PathVariable("id") Long id) {
        adminService.deleteDriver(id);
        return ResponseEntity.ok(ApiResponse.ok("Driver deleted successfully"));
    }

    // ---------------- Master Security Management ----------------
    @GetMapping("/security")
    public ResponseEntity<ApiResponse<List<SecurityStaffDTO>>> getAllSecurityStaff() {
        return ResponseEntity.ok(ApiResponse.ok("Security staff loaded", adminService.getAllSecurityStaff()));
    }

    @PostMapping("/security")
    public ResponseEntity<ApiResponse<SecurityStaffDTO>> createSecurityStaff(@Valid @RequestBody SecurityStaffDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Security staff account created successfully", adminService.createSecurityStaff(dto)));
    }

    @PutMapping("/security/{id}")
    public ResponseEntity<ApiResponse<SecurityStaffDTO>> updateSecurityStaff(@PathVariable("id") Long id, @Valid @RequestBody SecurityStaffDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Security staff account updated successfully", adminService.updateSecurityStaff(id, dto)));
    }

    @DeleteMapping("/security/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSecurityStaff(@PathVariable("id") Long id) {
        adminService.deleteSecurityStaff(id);
        return ResponseEntity.ok(ApiResponse.ok("Security staff deleted successfully"));
    }

    // ---------------- Master Routes Management ----------------
    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<RouteDTO>>> getAllRoutes() {
        return ResponseEntity.ok(ApiResponse.ok("Routes loaded", adminService.getAllRoutes()));
    }

    @PostMapping("/routes")
    public ResponseEntity<ApiResponse<RouteDTO>> createRoute(@Valid @RequestBody RouteDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Route created successfully", adminService.createRoute(dto)));
    }

    @PutMapping("/routes/{id}")
    public ResponseEntity<ApiResponse<RouteDTO>> updateRoute(@PathVariable("id") Long id, @Valid @RequestBody RouteDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Route updated successfully", adminService.updateRoute(id, dto)));
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable("id") Long id) {
        adminService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.ok("Route deleted successfully"));
    }

    // ---------------- Master Gates Management ----------------
    @GetMapping("/gates")
    public ResponseEntity<ApiResponse<List<GateDTO>>> getAllGates() {
        return ResponseEntity.ok(ApiResponse.ok("Gates loaded", adminService.getAllGates()));
    }

    @PostMapping("/gates")
    public ResponseEntity<ApiResponse<GateDTO>> createGate(@Valid @RequestBody GateDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Gate created successfully", adminService.createGate(dto)));
    }

    @PutMapping("/gates/{id}")
    public ResponseEntity<ApiResponse<GateDTO>> updateGate(@PathVariable("id") Long id, @Valid @RequestBody GateDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Gate updated successfully", adminService.updateGate(id, dto)));
    }

    @DeleteMapping("/gates/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGate(@PathVariable("id") Long id) {
        adminService.deleteGate(id);
        return ResponseEntity.ok(ApiResponse.ok("Gate deleted successfully"));
    }

    // ---------------- Assignments (1-to-1) ----------------
    @PostMapping("/assignments/driver-bus")
    public ResponseEntity<ApiResponse<Void>> assignDriverToBus(@Valid @RequestBody DriverAssignmentRequest req) {
        adminService.assignDriverToBus(req);
        return ResponseEntity.ok(ApiResponse.ok("Driver assigned to Bus successfully"));
    }

    @PostMapping("/assignments/security-gate")
    public ResponseEntity<ApiResponse<Void>> assignSecurityToGate(@Valid @RequestBody SecurityAssignmentRequest req) {
        adminService.assignSecurityToGate(req);
        return ResponseEntity.ok(ApiResponse.ok("Security assigned to Gate successfully"));
    }

    // ---------------- Reference IDs Management ----------------
    @GetMapping("/reference-ids")
    public ResponseEntity<ApiResponse<List<AdminReferenceDTO>>> getAllReferenceIds() {
        return ResponseEntity.ok(ApiResponse.ok("Reference IDs loaded", adminService.getAllReferenceIds()));
    }

    @PostMapping("/reference-ids/generate")
    public ResponseEntity<ApiResponse<AdminReferenceDTO>> generateReferenceId(@RequestBody(required = false) Map<String, String> body) {
        String notes = body != null ? body.get("notes") : null;
        return ResponseEntity.ok(ApiResponse.ok("Reference ID generated successfully", adminService.generateReferenceId(notes)));
    }
}
