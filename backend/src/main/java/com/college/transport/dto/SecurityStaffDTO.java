package com.college.transport.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SecurityStaffDTO {

    private Long id;

    @NotBlank(message = "Security staff name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Mobile number must be 10-15 digits")
    private String mobileNumber;

    @NotBlank(message = "Username is required")
    private String username;

    private String password;

    private String status = "ACTIVE";

    // Assignment info
    private Long assignedGateId;
    private String assignedGateName;

    public SecurityStaffDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAssignedGateId() {
        return assignedGateId;
    }

    public void setAssignedGateId(Long assignedGateId) {
        this.assignedGateId = assignedGateId;
    }

    public String getAssignedGateName() {
        return assignedGateName;
    }

    public void setAssignedGateName(String assignedGateName) {
        this.assignedGateName = assignedGateName;
    }
}
