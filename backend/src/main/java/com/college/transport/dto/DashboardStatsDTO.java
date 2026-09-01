package com.college.transport.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {

    private Long totalBuses = 0L;
    private Long totalDrivers = 0L;
    private Long totalSecurityStaff = 0L;
    private Long totalRoutes = 0L;
    private Long totalGates = 0L;

    private Long todayActiveBuses = 0L;
    private Long todayStudentCount = 0L;
    private Double todayDistance = 0.0;
    private Long runningTrips = 0L;
    private Long completedTrips = 0L;
    private Long pendingTrips = 0L;

    // Charts & Visualizations
    private List<Map<String, Object>> busWiseDistance;
    private List<Map<String, Object>> routeWiseStudents;
    private List<Map<String, Object>> weeklyDistanceTrend;
    private List<Map<String, Object>> tripStatusDistribution;

    public DashboardStatsDTO() {}

    public Long getTotalBuses() {
        return totalBuses;
    }

    public void setTotalBuses(Long totalBuses) {
        this.totalBuses = totalBuses;
    }

    public Long getTotalDrivers() {
        return totalDrivers;
    }

    public void setTotalDrivers(Long totalDrivers) {
        this.totalDrivers = totalDrivers;
    }

    public Long getTotalSecurityStaff() {
        return totalSecurityStaff;
    }

    public void setTotalSecurityStaff(Long totalSecurityStaff) {
        this.totalSecurityStaff = totalSecurityStaff;
    }

    public Long getTotalRoutes() {
        return totalRoutes;
    }

    public void setTotalRoutes(Long totalRoutes) {
        this.totalRoutes = totalRoutes;
    }

    public Long getTotalGates() {
        return totalGates;
    }

    public void setTotalGates(Long totalGates) {
        this.totalGates = totalGates;
    }

    public Long getTodayActiveBuses() {
        return todayActiveBuses;
    }

    public void setTodayActiveBuses(Long todayActiveBuses) {
        this.todayActiveBuses = todayActiveBuses;
    }

    public Long getTodayStudentCount() {
        return todayStudentCount;
    }

    public void setTodayStudentCount(Long todayStudentCount) {
        this.todayStudentCount = todayStudentCount;
    }

    public Double getTodayDistance() {
        return todayDistance;
    }

    public void setTodayDistance(Double todayDistance) {
        this.todayDistance = todayDistance;
    }

    public Long getRunningTrips() {
        return runningTrips;
    }

    public void setRunningTrips(Long runningTrips) {
        this.runningTrips = runningTrips;
    }

    public Long getCompletedTrips() {
        return completedTrips;
    }

    public void setCompletedTrips(Long completedTrips) {
        this.completedTrips = completedTrips;
    }

    public Long getPendingTrips() {
        return pendingTrips;
    }

    public void setPendingTrips(Long pendingTrips) {
        this.pendingTrips = pendingTrips;
    }

    public List<Map<String, Object>> getBusWiseDistance() {
        return busWiseDistance;
    }

    public void setBusWiseDistance(List<Map<String, Object>> busWiseDistance) {
        this.busWiseDistance = busWiseDistance;
    }

    public List<Map<String, Object>> getRouteWiseStudents() {
        return routeWiseStudents;
    }

    public void setRouteWiseStudents(List<Map<String, Object>> routeWiseStudents) {
        this.routeWiseStudents = routeWiseStudents;
    }

    public List<Map<String, Object>> getWeeklyDistanceTrend() {
        return weeklyDistanceTrend;
    }

    public void setWeeklyDistanceTrend(List<Map<String, Object>> weeklyDistanceTrend) {
        this.weeklyDistanceTrend = weeklyDistanceTrend;
    }

    public List<Map<String, Object>> getTripStatusDistribution() {
        return tripStatusDistribution;
    }

    public void setTripStatusDistribution(List<Map<String, Object>> tripStatusDistribution) {
        this.tripStatusDistribution = tripStatusDistribution;
    }
}
