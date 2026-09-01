package com.college.transport.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "buses", indexes = {
    @Index(name = "idx_bus_number", columnList = "bus_number")
})
public class Bus {

    public enum Status {
        ACTIVE,
        MAINTENANCE,
        INACTIVE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", unique = true, nullable = false)
    private Integer busNumber;

    @Column(name = "registration_number", unique = true, nullable = false, length = 50)
    private String registrationNumber;

    @Column(nullable = false)
    private Integer capacity = 55;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_gate_id")
    private Gate assignedGate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Bus() {}

    public Bus(Integer busNumber, String registrationNumber, Integer capacity, Route route, Gate assignedGate) {
        this.busNumber = busNumber;
        this.registrationNumber = registrationNumber;
        this.capacity = capacity;
        this.route = route;
        this.assignedGate = assignedGate;
        this.status = Status.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

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

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public Gate getAssignedGate() {
        return assignedGate;
    }

    public void setAssignedGate(Gate assignedGate) {
        this.assignedGate = assignedGate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
