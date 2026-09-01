package com.college.transport.service;

import com.college.transport.dto.*;
import com.college.transport.entity.*;
import com.college.transport.exception.BadRequestException;
import com.college.transport.exception.ResourceNotFoundException;
import com.college.transport.repository.*;
import com.college.transport.security.JwtUtils;
import com.college.transport.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AdminReferenceRepository adminReferenceRepository;

    @Autowired
    private DriverAssignmentRepository driverAssignmentRepository;

    @Autowired
    private SecurityAssignmentRepository securityAssignmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public ReferenceValidationResponse validateReferenceId(String referenceCode) {
        if (referenceCode == null || referenceCode.trim().isEmpty()) {
            return new ReferenceValidationResponse(false, "", "INVALID", "Reference ID cannot be empty");
        }

        Optional<AdminReference> refOpt = adminReferenceRepository.findByReferenceCode(referenceCode.trim());
        if (refOpt.isEmpty()) {
            return new ReferenceValidationResponse(false, referenceCode, "INVALID", "Invalid Reference ID. Not found in system.");
        }

        AdminReference ref = refOpt.get();
        if (ref.getStatus() == AdminReference.Status.USED) {
            return new ReferenceValidationResponse(false, referenceCode, "USED", "Reference ID has already been used for registration.");
        }

        return new ReferenceValidationResponse(true, referenceCode, "UNUSED", "Reference ID is valid and ready for registration.");
    }

    @Transactional
    public AuthResponse registerAdmin(AdminRegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        // Validate Reference ID strictly
        AdminReference reference = adminReferenceRepository.findByReferenceCodeAndStatus(
                request.getReferenceId().trim(),
                AdminReference.Status.UNUSED
        ).orElseThrow(() -> new BadRequestException("Registration Rejected: Reference ID is invalid or already used."));

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(RoleType.ROLE_ADMIN)));

        User admin = new User();
        admin.setReferenceId(reference.getReferenceCode());
        admin.setName(request.getName().trim());
        admin.setEmail(request.getEmail().trim().toLowerCase());
        admin.setMobileNumber(request.getMobileNumber().trim());
        admin.setUsername(request.getUsername().trim());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole(adminRole);
        admin.setStatus(User.Status.ACTIVE);

        userRepository.save(admin);

        // Mark Reference ID as USED
        reference.setStatus(AdminReference.Status.USED);
        reference.setUsedAt(LocalDateTime.now());
        reference.setUsedByEmail(admin.getEmail());
        adminReferenceRepository.save(reference);

        // Auto login and return token
        return login(new AuthRequest(request.getUsername(), request.getPassword()));
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AuthResponse response = new AuthResponse();
        response.setToken(jwt);
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setMobileNumber(user.getMobileNumber());

        String roleName = user.getRole().getName().name();
        response.setRole(roleName);
        response.setSimpleRole(roleName.replace("ROLE_", ""));

        // Populate role-specific context
        if (user.getRole().getName() == RoleType.ROLE_SECURITY) {
            securityAssignmentRepository.findActiveBySecurityId(user.getId()).ifPresent(sa -> {
                response.setAssignedGateId(sa.getGate().getId());
                response.setAssignedGateName(sa.getGate().getGateName());
            });
        } else if (user.getRole().getName() == RoleType.ROLE_DRIVER) {
            driverAssignmentRepository.findActiveByDriverId(user.getId()).ifPresent(da -> {
                response.setAssignedBusId(da.getBus().getId());
                response.setAssignedBusNumber(da.getBus().getBusNumber());
                response.setAssignedRegistrationNumber(da.getBus().getRegistrationNumber());
                if (da.getBus().getRoute() != null) {
                    response.setAssignedRouteName(da.getBus().getRoute().getRouteName());
                }
            });
        }

        return response;
    }
}
