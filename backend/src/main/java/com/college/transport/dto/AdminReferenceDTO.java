package com.college.transport.dto;

import java.time.LocalDateTime;

public class AdminReferenceDTO {

    private Long id;
    private String referenceCode;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime usedAt;
    private String usedByEmail;
    private String notes;

    public AdminReferenceDTO() {}

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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
