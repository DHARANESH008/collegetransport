package com.college.transport.dto;

import java.util.List;

public class ReportSummaryDTO {

    private String filterType;
    private String periodLabel;
    private Long totalTrips = 0L;
    private Double totalDistance = 0.0;
    private Long totalStudents = 0L;
    private Double avgDistancePerTrip = 0.0;
    private Double avgStudentsPerTrip = 0.0;
    private List<TripHistoryDTO> records;

    public ReportSummaryDTO() {}

    public String getFilterType() {
        return filterType;
    }

    public void setFilterType(String filterType) {
        this.filterType = filterType;
    }

    public String getPeriodLabel() {
        return periodLabel;
    }

    public void setPeriodLabel(String periodLabel) {
        this.periodLabel = periodLabel;
    }

    public Long getTotalTrips() {
        return totalTrips;
    }

    public void setTotalTrips(Long totalTrips) {
        this.totalTrips = totalTrips;
    }

    public Double getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(Double totalDistance) {
        this.totalDistance = totalDistance;
    }

    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Double getAvgDistancePerTrip() {
        return avgDistancePerTrip;
    }

    public void setAvgDistancePerTrip(Double avgDistancePerTrip) {
        this.avgDistancePerTrip = avgDistancePerTrip;
    }

    public Double getAvgStudentsPerTrip() {
        return avgStudentsPerTrip;
    }

    public void setAvgStudentsPerTrip(Double avgStudentsPerTrip) {
        this.avgStudentsPerTrip = avgStudentsPerTrip;
    }

    public List<TripHistoryDTO> getRecords() {
        return records;
    }

    public void setRecords(List<TripHistoryDTO> records) {
        this.records = records;
    }
}
