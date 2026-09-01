package com.college.transport.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "trip_histories", indexes = {
    @Index(name = "idx_trip_date", columnList = "trip_date"),
    @Index(name = "idx_trip_bus", columnList = "bus_id, trip_date"),
    @Index(name = "idx_trip_driver", columnList = "driver_id"),
    @Index(name = "idx_trip_status", columnList = "journey_status"),
    @Index(name = "idx_trip_created", columnList = "created_at")
})
public class TripHistory {

    public enum JourneyStatus {
        NOT_STARTED,
        IN_TRANSIT,
        COLLEGE_ARRIVED,
        COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(name = "bus_number", nullable = false)
    private Integer busNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(name = "driver_name", nullable = false, length = 150)
    private String driverName;

    @Column(name = "driver_mobile", nullable = false, length = 20)
    private String driverMobile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(name = "route_name", length = 150)
    private String routeName;

    @Column(name = "trip_date", nullable = false)
    private LocalDate tripDate = LocalDate.now();

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "start_km", nullable = false)
    private Double startKm = 0.0;

    @Column(name = "end_km")
    private Double endKm;

    @Column(name = "total_distance")
    private Double totalDistance;

    @Column(name = "student_count")
    private Integer studentCount = 0;

    @Column(name = "student_marked_time")
    private LocalTime studentMarkedTime;

    @Column(name = "is_late_arrival")
    private Boolean isLateArrival = false;

    @Column(name = "gate_name", length = 100)
    private String gateName;

    @Column(name = "gate_entry_time")
    private LocalTime gateEntryTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "journey_status", nullable = false, length = 30)
    private JourneyStatus journeyStatus = JourneyStatus.NOT_STARTED;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public TripHistory() {}

    public TripHistory(Bus bus, User driver, Route route, LocalDate tripDate, Double startKm) {
        this.bus = bus;
        this.busNumber = bus != null ? bus.getBusNumber() : 0;
        this.driver = driver;
        this.driverName = driver != null ? driver.getName() : "";
        this.driverMobile = driver != null ? driver.getMobileNumber() : "";
        this.route = route;
        this.routeName = route != null ? route.getRouteName() : "";
        this.tripDate = tripDate != null ? tripDate : LocalDate.now();
        this.startKm = startKm != null ? startKm : 0.0;
        this.journeyStatus = JourneyStatus.NOT_STARTED;
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

    public User getDriver() {
        return driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
        if (driver != null) {
            this.driverName = driver.getName();
            this.driverMobile = driver.getMobileNumber();
        }
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverMobile() {
        return driverMobile;
    }

    public void setDriverMobile(String driverMobile) {
        this.driverMobile = driverMobile;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
        if (route != null) {
            this.routeName = route.getRouteName();
        }
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public LocalDate getTripDate() {
        return tripDate;
    }

    public void setTripDate(LocalDate tripDate) {
        this.tripDate = tripDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Double getStartKm() {
        return startKm;
    }

    public void setStartKm(Double startKm) {
        this.startKm = startKm;
    }

    public Double getEndKm() {
        return endKm;
    }

    public void setEndKm(Double endKm) {
        this.endKm = endKm;
    }

    public Double getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(Double totalDistance) {
        this.totalDistance = totalDistance;
    }

    public Integer getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Integer studentCount) {
        this.studentCount = studentCount;
    }

    public LocalTime getStudentMarkedTime() {
        return studentMarkedTime;
    }

    public void setStudentMarkedTime(LocalTime studentMarkedTime) {
        this.studentMarkedTime = studentMarkedTime;
    }

    public Boolean getIsLateArrival() {
        return isLateArrival != null && isLateArrival;
    }

    public void setIsLateArrival(Boolean isLateArrival) {
        this.isLateArrival = isLateArrival;
    }

    public String getGateName() {
        return gateName;
    }

    public void setGateName(String gateName) {
        this.gateName = gateName;
    }

    public LocalTime getGateEntryTime() {
        return gateEntryTime;
    }

    public void setGateEntryTime(LocalTime gateEntryTime) {
        this.gateEntryTime = gateEntryTime;
    }

    public JourneyStatus getJourneyStatus() {
        return journeyStatus;
    }

    public void setJourneyStatus(JourneyStatus journeyStatus) {
        this.journeyStatus = journeyStatus;
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
