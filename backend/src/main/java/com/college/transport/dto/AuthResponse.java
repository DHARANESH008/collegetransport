package com.college.transport.dto;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String name;
    private String mobileNumber;
    private String role; // "ROLE_ADMIN", "ROLE_DRIVER", "ROLE_SECURITY"
    private String simpleRole; // "ADMIN", "DRIVER", "SECURITY"

    // Contextual assignments
    private Long assignedGateId;
    private String assignedGateName;

    private Long assignedBusId;
    private Integer assignedBusNumber;
    private String assignedRegistrationNumber;
    private String assignedRouteName;

    public AuthResponse() {}

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSimpleRole() {
        return simpleRole;
    }

    public void setSimpleRole(String simpleRole) {
        this.simpleRole = simpleRole;
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

    public Long getAssignedBusId() {
        return assignedBusId;
    }

    public void setAssignedBusId(Long assignedBusId) {
        this.assignedBusId = assignedBusId;
    }

    public Integer getAssignedBusNumber() {
        return assignedBusNumber;
    }

    public void setAssignedBusNumber(Integer assignedBusNumber) {
        this.assignedBusNumber = assignedBusNumber;
    }

    public String getAssignedRegistrationNumber() {
        return assignedRegistrationNumber;
    }

    public void setAssignedRegistrationNumber(String assignedRegistrationNumber) {
        this.assignedRegistrationNumber = assignedRegistrationNumber;
    }

    public String getAssignedRouteName() {
        return assignedRouteName;
    }

    public void setAssignedRouteName(String assignedRouteName) {
        this.assignedRouteName = assignedRouteName;
    }
}
