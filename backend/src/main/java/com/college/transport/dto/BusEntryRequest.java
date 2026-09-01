package com.college.transport.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class BusEntryRequest {

    @NotNull(message = "Bus Number is required")
    @Min(value = 0, message = "Bus Number must be between 0 and 150")
    @Max(value = 150, message = "Bus Number must be between 0 and 150")
    private Integer busNumber;

    public BusEntryRequest() {}

    public BusEntryRequest(Integer busNumber) {
        this.busNumber = busNumber;
    }

    public Integer getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(Integer busNumber) {
        this.busNumber = busNumber;
    }
}
