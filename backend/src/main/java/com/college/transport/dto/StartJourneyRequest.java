package com.college.transport.dto;

import jakarta.validation.constraints.DecimalMin;

public class StartJourneyRequest {

    @DecimalMin(value = "0.0", message = "Start KM must be 0 or positive")
    private Double manualStartKm;

    private String startKmPhoto;

    public StartJourneyRequest() {}

    public StartJourneyRequest(Double manualStartKm) {
        this.manualStartKm = manualStartKm;
    }

    public Double getManualStartKm() {
        return manualStartKm;
    }

    public void setManualStartKm(Double manualStartKm) {
        this.manualStartKm = manualStartKm;
    }

    public String getStartKmPhoto() {
        return startKmPhoto;
    }

    public void setStartKmPhoto(String startKmPhoto) {
        this.startKmPhoto = startKmPhoto;
    }
}
