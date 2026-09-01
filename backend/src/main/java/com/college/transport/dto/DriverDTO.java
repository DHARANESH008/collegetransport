package com.college.transport.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class DriverDTO {

    private Long id;

    @NotBlank(message = "Driver name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Mobile number must be 10-15 digits")
    private String mobileNumber;

    private String licenseNumber;
    private String bloodGroup;
    private String address;
    private String photoUrl;

    @NotBlank(message = "Username is required")
    private String username;

    private String password;

    private String status = "ACTIVE";

    // Assignment info
    private Long assignedBusId;
    private Integer assignedBusNumber;
    private String assignedRouteName;

    public DriverDTO() {}

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

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
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

    public String getAssignedRouteName() {
        return assignedRouteName;
    }

    public void setAssignedRouteName(String assignedRouteName) {
        this.assignedRouteName = assignedRouteName;
    }
}
