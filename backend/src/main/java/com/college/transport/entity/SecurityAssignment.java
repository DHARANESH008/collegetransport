package com.college.transport.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_assignments")
public class SecurityAssignment {

    public enum Status {
        ACTIVE,
        INACTIVE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "security_id", unique = true, nullable = false)
    private User security;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gate_id", nullable = false)
    private Gate gate;

    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public SecurityAssignment() {}

    public SecurityAssignment(User security, Gate gate) {
        this.security = security;
        this.gate = gate;
        this.assignedDate = LocalDate.now();
        this.status = Status.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getSecurity() {
        return security;
    }

    public void setSecurity(User security) {
        this.security = security;
    }

    public Gate getGate() {
        return gate;
    }

    public void setGate(Gate gate) {
        this.gate = gate;
    }

    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
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
}
