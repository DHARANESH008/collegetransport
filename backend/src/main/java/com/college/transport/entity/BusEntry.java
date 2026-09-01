package com.college.transport.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bus_entries", uniqueConstraints = {
    @UniqueConstraint(name = "uk_bus_entry_per_day", columnNames = {"bus_id", "entry_date"})
}, indexes = {
    @Index(name = "idx_entry_date", columnList = "entry_date"),
    @Index(name = "idx_entry_bus", columnList = "bus_number"),
    @Index(name = "idx_entry_created", columnList = "created_at")
})
public class BusEntry {

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

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate = LocalDate.now();

    @Column(name = "entry_time", nullable = false)
    private LocalTime entryTime = LocalTime.now();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public BusEntry() {}

    public BusEntry(Bus bus, Gate gate, User securityUser, LocalDate entryDate, LocalTime entryTime) {
        this.bus = bus;
        this.busNumber = bus.getBusNumber();
        this.gate = gate;
        this.gateName = gate.getGateName();
        this.securityUser = securityUser;
        this.entryDate = entryDate != null ? entryDate : LocalDate.now();
        this.entryTime = entryTime != null ? entryTime : LocalTime.now();
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

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public LocalTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalTime entryTime) {
        this.entryTime = entryTime;
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
