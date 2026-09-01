package com.college.transport.controller;

import com.college.transport.dto.*;
import com.college.transport.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/validate-reference-id")
    public ResponseEntity<ApiResponse<ReferenceValidationResponse>> validateReferenceId(@RequestParam("code") String code) {
        ReferenceValidationResponse res = authService.validateReferenceId(code);
        return ResponseEntity.ok(ApiResponse.ok(res.getMessage(), res));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<ApiResponse<AuthResponse>> registerAdmin(@Valid @RequestBody AdminRegisterRequest request) {
        AuthResponse response = authService.registerAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok("Admin registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<String>> checkMe(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.ok(ApiResponse.ok("Not authenticated", null));
        }
        return ResponseEntity.ok(ApiResponse.ok("Authenticated as " + auth.getName(), auth.getName()));
    }
}
