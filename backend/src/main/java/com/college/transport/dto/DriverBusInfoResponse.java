package com.college.transport.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class DriverBusInfoResponse {

    private Long busId;
    private Integer busNumber;
    private String registrationNumber;
    private Long routeId;
    private String routeName;
    private Double approxDistanceKm;

    // Start KM logic: previous day's end KM automatically loaded
    private Double startKm;
    private Boolean isAutoStartKm;
    private Double previousEndKm;

    // Today's trip current state
    private Long tripId;
    private LocalDate tripDate;
    private String journeyStatus; // "NOT_STARTED", "IN_TRANSIT", "COLLEGE_ARRIVED", "COMPLETED"
    private LocalTime startTime;
    private LocalTime endTime;
    private Double endKm;
    private Double totalDistance;
    private Integer studentCount = 0;
    // Security Gate check & time window fields
    private Boolean gateEntryRecorded = false;
    private LocalTime gateEntryTime;
    private String gateName;
    private Boolean isWithinAllowedTimeWindow = true;
    private Boolean isLateArrival = false;
    private LocalTime studentMarkedTime;

    public DriverBusInfoResponse() {}

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
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

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public Double getApproxDistanceKm() {
        return approxDistanceKm;
    }

    public void setApproxDistanceKm(Double approxDistanceKm) {
        this.approxDistanceKm = approxDistanceKm;
    }

    public Double getStartKm() {
        return startKm;
    }

    public void setStartKm(Double startKm) {
        this.startKm = startKm;
    }

    public Boolean getIsAutoStartKm() {
        return isAutoStartKm;
    }

    public void setIsAutoStartKm(Boolean autoStartKm) {
        isAutoStartKm = autoStartKm;
    }

    public Double getPreviousEndKm() {
        return previousEndKm;
    }

    public void setPreviousEndKm(Double previousEndKm) {
        this.previousEndKm = previousEndKm;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public LocalDate getTripDate() {
        return tripDate;
    }

    public void setTripDate(LocalDate tripDate) {
        this.tripDate = tripDate;
    }

    public String getJourneyStatus() {
        return journeyStatus;
    }

    public void setJourneyStatus(String journeyStatus) {
        this.journeyStatus = journeyStatus;
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

    public Boolean getGateEntryRecorded() {
        return gateEntryRecorded != null && gateEntryRecorded;
    }

    public void setGateEntryRecorded(Boolean gateEntryRecorded) {
        this.gateEntryRecorded = gateEntryRecorded;
    }

    public LocalTime getGateEntryTime() {
        return gateEntryTime;
    }

    public void setGateEntryTime(LocalTime gateEntryTime) {
        this.gateEntryTime = gateEntryTime;
    }

    public String getGateName() {
        return gateName;
    }

    public void setGateName(String gateName) {
        this.gateName = gateName;
    }

    public Boolean getIsWithinAllowedTimeWindow() {
        return isWithinAllowedTimeWindow != null && isWithinAllowedTimeWindow;
    }

    public void setIsWithinAllowedTimeWindow(Boolean withinAllowedTimeWindow) {
        isWithinAllowedTimeWindow = withinAllowedTimeWindow;
    }

    public Boolean getIsLateArrival() {
        return isLateArrival != null && isLateArrival;
    }

    public void setIsLateArrival(Boolean lateArrival) {
        isLateArrival = lateArrival;
    }

    public LocalTime getStudentMarkedTime() {
        return studentMarkedTime;
    }

    public void setStudentMarkedTime(LocalTime studentMarkedTime) {
        this.studentMarkedTime = studentMarkedTime;
    }
}
