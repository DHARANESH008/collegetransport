package com.college.transport.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class TripHistoryDTO {

    private Long id;
    private Long busId;
    private Integer busNumber;
    private String registrationNumber;
    private Long driverId;
    private String driverName;
    private String driverMobile;
    private Long routeId;
    private String routeName;
    private String gateName;
    private LocalTime gateEntryTime;
    private LocalDate tripDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Double startKm;
    private Double endKm;
    private Double totalDistance;
    private Integer studentCount;
    private Boolean isLateArrival = false;
    private LocalTime studentMarkedTime;
    private String journeyStatus;
    private String startKmPhoto;
    private String endKmPhoto;

    public TripHistoryDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
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

    public String getJourneyStatus() {
        return journeyStatus;
    }

    public void setJourneyStatus(String journeyStatus) {
        this.journeyStatus = journeyStatus;
    }

    public String getStartKmPhoto() {
        return startKmPhoto;
    }

    public void setStartKmPhoto(String startKmPhoto) {
        this.startKmPhoto = startKmPhoto;
    }

    public String getEndKmPhoto() {
        return endKmPhoto;
    }

    public void setEndKmPhoto(String endKmPhoto) {
        this.endKmPhoto = endKmPhoto;
    }
}
