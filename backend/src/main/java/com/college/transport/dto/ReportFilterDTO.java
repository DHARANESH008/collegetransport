package com.college.transport.dto;

import java.time.LocalDate;
import java.util.List;

public class ReportFilterDTO {

    public enum FilterType {
        DAILY,
        WEEKLY,
        MONTHLY,
        CUSTOM
    }

    private FilterType filterType = FilterType.DAILY;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long routeId;
    private Integer busNumber;

    public ReportFilterDTO() {}

    public FilterType getFilterType() {
        return filterType;
    }

    public void setFilterType(FilterType filterType) {
        this.filterType = filterType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public Integer getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(Integer busNumber) {
        this.busNumber = busNumber;
    }
}
