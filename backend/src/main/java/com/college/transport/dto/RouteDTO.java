package com.college.transport.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RouteDTO {

    private Long id;

    @NotBlank(message = "Route name is required")
    private String routeName;

    @NotBlank(message = "Start point is required")
    private String startPoint;

    @NotBlank(message = "End point is required")
    private String endPoint;

    private String stops;

    @NotNull(message = "Approximate distance is required")
    private Double approxDistanceKm;

    public RouteDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public String getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(String startPoint) {
        this.startPoint = startPoint;
    }

    public String getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(String endPoint) {
        this.endPoint = endPoint;
    }

    public String getStops() {
        return stops;
    }

    public void setStops(String stops) {
        this.stops = stops;
    }

    public Double getApproxDistanceKm() {
        return approxDistanceKm;
    }

    public void setApproxDistanceKm(Double approxDistanceKm) {
        this.approxDistanceKm = approxDistanceKm;
    }
}
