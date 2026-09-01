package com.college.transport.dto;

public class BusSearchResponse {

    private Integer busNumber;
    private String registrationNumber;
    private String route;
    private String driverName;
    private String driverMobile;
    private String assignedGate;
    private String securityGateEntryTime;
    private String journeyStartTime;
    private String journeyEndTime;
    private Double startKm;
    private Double endKm;
    private Double totalDistance;
    private Integer studentCount;
    private String journeyStatus; // "NOT_STARTED", "IN_TRANSIT", "COLLEGE_ARRIVED", "COMPLETED", "NO_ACTIVITY"
    private String entryDate;
    private String busStatus;
    private Integer capacity;

    public BusSearchResponse() {}

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

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
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

    public String getAssignedGate() {
        return assignedGate;
    }

    public void setAssignedGate(String assignedGate) {
        this.assignedGate = assignedGate;
    }

    public String getSecurityGateEntryTime() {
        return securityGateEntryTime;
    }

    public void setSecurityGateEntryTime(String securityGateEntryTime) {
        this.securityGateEntryTime = securityGateEntryTime;
    }

    public String getJourneyStartTime() {
        return journeyStartTime;
    }

    public void setJourneyStartTime(String journeyStartTime) {
        this.journeyStartTime = journeyStartTime;
    }

    public String getJourneyEndTime() {
        return journeyEndTime;
    }

    public void setJourneyEndTime(String journeyEndTime) {
        this.journeyEndTime = journeyEndTime;
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

    public String getJourneyStatus() {
        return journeyStatus;
    }

    public void setJourneyStatus(String journeyStatus) {
        this.journeyStatus = journeyStatus;
    }

    public String getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(String entryDate) {
        this.entryDate = entryDate;
    }

    public String getBusStatus() {
        return busStatus;
    }

    public void setBusStatus(String busStatus) {
        this.busStatus = busStatus;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
}
