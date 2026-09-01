package com.college.transport.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BusDTO {

    private Long id;

    @NotNull(message = "Bus Number is required")
    @Min(value = 0, message = "Bus Number must be between 0 and 150")
    @Max(value = 150, message = "Bus Number must be between 0 and 150")
    private Integer busNumber;

    @NotBlank(message = "Registration Number is required")
    private String registrationNumber;

    private Integer capacity = 55;

    private Long routeId;
    private String routeName;

    private Long assignedGateId;
    private String assignedGateName;

    private Long assignedDriverId;
    private String assignedDriverName;
    private String assignedDriverMobile;

    private String status = "ACTIVE";

    public BusDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(Integer busNumber) {
        this.busNumber = busNumber;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
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

    public Long getAssignedDriverId() {
        return assignedDriverId;
    }

    public void setAssignedDriverId(Long assignedDriverId) {
        this.assignedDriverId = assignedDriverId;
    }

    public String getAssignedDriverName() {
        return assignedDriverName;
    }

    public void setAssignedDriverName(String assignedDriverName) {
        this.assignedDriverName = assignedDriverName;
    }

    public String getAssignedDriverMobile() {
        return assignedDriverMobile;
    }

    public void setAssignedDriverMobile(String assignedDriverMobile) {
        this.assignedDriverMobile = assignedDriverMobile;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
