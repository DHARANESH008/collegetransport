package com.college.transport.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class EndJourneyRequest {

    @NotNull(message = "End KM is required")
    @DecimalMin(value = "0.0", message = "End KM must be positive")
    private Double endKm;

    public EndJourneyRequest() {}

    public EndJourneyRequest(Double endKm) {
        this.endKm = endKm;
    }

    public Double getEndKm() {
        return endKm;
    }

    public void setEndKm(Double endKm) {
        this.endKm = endKm;
    }
}
