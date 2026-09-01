package com.college.transport.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_cleanup_logs")
public class SystemCleanupLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cleanup_timestamp")
    private LocalDateTime cleanupTimestamp = LocalDateTime.now();

    @Column(name = "cutoff_date", nullable = false)
    private LocalDate cutoffDate;

    @Column(name = "bus_entries_deleted")
    private Integer busEntriesDeleted = 0;

    @Column(name = "trip_histories_deleted")
    private Integer tripHistoriesDeleted = 0;

    @Column(length = 50, nullable = false)
    private String status;

    @Column(length = 255)
    private String message;

    public SystemCleanupLog() {}

    public SystemCleanupLog(LocalDate cutoffDate, Integer busEntriesDeleted, Integer tripHistoriesDeleted, String status, String message) {
        this.cutoffDate = cutoffDate;
        this.busEntriesDeleted = busEntriesDeleted;
        this.tripHistoriesDeleted = tripHistoriesDeleted;
        this.status = status;
        this.message = message;
        this.cleanupTimestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCleanupTimestamp() {
        return cleanupTimestamp;
    }

    public void setCleanupTimestamp(LocalDateTime cleanupTimestamp) {
        this.cleanupTimestamp = cleanupTimestamp;
    }

    public LocalDate getCutoffDate() {
        return cutoffDate;
    }

    public void setCutoffDate(LocalDate cutoffDate) {
        this.cutoffDate = cutoffDate;
    }

    public Integer getBusEntriesDeleted() {
        return busEntriesDeleted;
    }

    public void setBusEntriesDeleted(Integer busEntriesDeleted) {
        this.busEntriesDeleted = busEntriesDeleted;
    }

    public Integer getTripHistoriesDeleted() {
        return tripHistoriesDeleted;
    }

    public void setTripHistoriesDeleted(Integer tripHistoriesDeleted) {
        this.tripHistoriesDeleted = tripHistoriesDeleted;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
