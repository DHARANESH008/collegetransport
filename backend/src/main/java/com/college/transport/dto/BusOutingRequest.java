package com.college.transport.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BusOutingRequest {

    @NotNull(message = "Bus number is required")
    @Min(value = 0, message = "Bus number must be between 0 and 150")
    @Max(value = 150, message = "Bus number must be between 0 and 150")
    private Integer busNumber;

    @NotBlank(message = "Outing reason is required")
    private String reason;

    public BusOutingRequest() {}

    public BusOutingRequest(Integer busNumber, String reason) {
        this.busNumber = busNumber;
        this.reason = reason;
    }

    public Integer getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(Integer busNumber) {
        this.busNumber = busNumber;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
