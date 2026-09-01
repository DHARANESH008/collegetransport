package com.college.transport.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "routes")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "route_name", unique = true, nullable = false, length = 150)
    private String routeName;

    @Column(name = "start_point", nullable = false, length = 150)
    private String startPoint;

    @Column(name = "end_point", nullable = false, length = 150)
    private String endPoint;

    @Column(columnDefinition = "TEXT")
    private String stops;

    @Column(name = "approx_distance_km")
    private Double approxDistanceKm = 0.0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Route() {}

    public Route(String routeName, String startPoint, String endPoint, String stops, Double approxDistanceKm) {
        this.routeName = routeName;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.stops = stops;
        this.approxDistanceKm = approxDistanceKm;
        this.createdAt = LocalDateTime.now();
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
