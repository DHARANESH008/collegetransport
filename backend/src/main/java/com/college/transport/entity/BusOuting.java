package com.college.transport.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bus_outings", indexes = {
    @Index(name = "idx_outing_date", columnList = "outing_date"),
    @Index(name = "idx_outing_bus", columnList = "bus_number"),
    @Index(name = "idx_outing_created", columnList = "created_at")
})
public class BusOuting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(name = "bus_number", nullable = false)
    private Integer busNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gate_id", nullable = false)
    private Gate gate;

    @Column(name = "gate_name", nullable = false, length = 100)
    private String gateName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "security_user_id", nullable = false)
    private User securityUser;

    @Column(name = "exit_reason", nullable = false, length = 255)
    private String exitReason;

    @Column(name = "outing_date", nullable = false)
    private LocalDate outingDate = LocalDate.now();

    @Column(name = "exit_time", nullable = false)
    private LocalTime exitTime = LocalTime.now();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public BusOuting() {}

    public BusOuting(Bus bus, Gate gate, User securityUser, String exitReason) {
        this.bus = bus;
        this.busNumber = bus.getBusNumber();
        this.gate = gate;
        this.gateName = gate.getGateName();
        this.securityUser = securityUser;
        this.exitReason = exitReason;
        this.outingDate = LocalDate.now();
        this.exitTime = LocalTime.now();
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
        if (bus != null) {
            this.busNumber = bus.getBusNumber();
        }
    }

    public Integer getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(Integer busNumber) {
        this.busNumber = busNumber;
    }

    public Gate getGate() {
        return gate;
    }

    public void setGate(Gate gate) {
        this.gate = gate;
        if (gate != null) {
            this.gateName = gate.getGateName();
        }
    }

    public String getGateName() {
        return gateName;
    }

    public void setGateName(String gateName) {
        this.gateName = gateName;
    }

    public User getSecurityUser() {
        return securityUser;
    }

    public void setSecurityUser(User securityUser) {
        this.securityUser = securityUser;
    }

    public String getExitReason() {
        return exitReason;
    }

    public void setExitReason(String exitReason) {
        this.exitReason = exitReason;
    }

    public LocalDate getOutingDate() {
        return outingDate;
    }

    public void setOutingDate(LocalDate outingDate) {
        this.outingDate = outingDate;
    }

    public LocalTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalTime exitTime) {
        this.exitTime = exitTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
