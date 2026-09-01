package com.college.transport.dto;

import jakarta.validation.constraints.NotNull;

public class DriverAssignmentRequest {

    @NotNull(message = "Driver ID is required")
    private Long driverId;

    @NotNull(message = "Bus ID is required")
    private Long busId;

    public DriverAssignmentRequest() {}

    public DriverAssignmentRequest(Long driverId, Long busId) {
        this.driverId = driverId;
        this.busId = busId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }
}
