package com.college.transport.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_references", indexes = {
    @Index(name = "idx_ref_code", columnList = "reference_code"),
    @Index(name = "idx_ref_status", columnList = "status")
})
public class AdminReference {

    public enum Status {
        UNUSED,
        USED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_code", unique = true, nullable = false, length = 100)
    private String referenceCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.UNUSED;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "used_by_email", length = 150)
    private String usedByEmail;

    @Column(name = "notes", length = 255)
    private String notes;

    public AdminReference() {}

    public AdminReference(String referenceCode, String notes) {
        this.referenceCode = referenceCode;
        this.notes = notes;
        this.status = Status.UNUSED;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
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

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public void setUsedAt(LocalDateTime usedAt) {
        this.usedAt = usedAt;
    }

    public String getUsedByEmail() {
        return usedByEmail;
    }

    public void setUsedByEmail(String usedByEmail) {
        this.usedByEmail = usedByEmail;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
