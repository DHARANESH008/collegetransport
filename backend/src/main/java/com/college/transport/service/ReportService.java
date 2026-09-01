package com.college.transport.service;

import com.college.transport.dto.ReportFilterDTO;
import com.college.transport.dto.ReportSummaryDTO;
import com.college.transport.dto.TripHistoryDTO;
import com.college.transport.entity.BusEntry;
import com.college.transport.entity.TripHistory;
import com.college.transport.repository.BusEntryRepository;
import com.college.transport.repository.TripHistoryRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private TripHistoryRepository tripHistoryRepository;

    @Autowired
    private BusEntryRepository busEntryRepository;

    public ReportSummaryDTO generateReport(ReportFilterDTO filter) {
        LocalDate startDate;
        LocalDate endDate = LocalDate.now();
        String periodLabel;

        if (filter.getFilterType() == null) {
            filter.setFilterType(ReportFilterDTO.FilterType.DAILY);
        }

        switch (filter.getFilterType()) {
            case DAILY:
                startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.now();
                endDate = startDate;
                periodLabel = "Daily Report (" + startDate + ")";
                break;
            case WEEKLY:
                startDate = endDate.minusDays(7);
                periodLabel = "Weekly Report (" + startDate + " to " + endDate + ")";
                break;
            case MONTHLY:
                startDate = endDate.minusMonths(1);
                periodLabel = "Monthly Report (" + startDate + " to " + endDate + ")";
                break;
            case CUSTOM:
            default:
                startDate = filter.getStartDate() != null ? filter.getStartDate() : endDate.minusDays(30);
                endDate = filter.getEndDate() != null ? filter.getEndDate() : LocalDate.now();
                periodLabel = "Report (" + startDate + " to " + endDate + ")";
                break;
        }

        List<TripHistory> trips = tripHistoryRepository.findBetweenDates(startDate, endDate);

        // Apply route / bus filters if specified
        if (filter.getRouteId() != null) {
            trips = trips.stream()
                    .filter(t -> t.getRoute() != null && t.getRoute().getId().equals(filter.getRouteId()))
                    .collect(Collectors.toList());
        }
        if (filter.getBusNumber() != null) {
            trips = trips.stream()
                    .filter(t -> t.getBusNumber().equals(filter.getBusNumber()))
                    .collect(Collectors.toList());
        }

        List<TripHistoryDTO> records = new ArrayList<>();
        double totalDistance = 0.0;
        long totalStudents = 0L;

        for (TripHistory th : trips) {
            TripHistoryDTO dto = new TripHistoryDTO();
            dto.setId(th.getId());
            dto.setBusId(th.getBus().getId());
            dto.setBusNumber(th.getBusNumber());
            dto.setRegistrationNumber(th.getBus().getRegistrationNumber());
            dto.setDriverId(th.getDriver().getId());
            dto.setDriverName(th.getDriverName());
            dto.setDriverMobile(th.getDriverMobile());
            dto.setRouteName(th.getRouteName());
            dto.setTripDate(th.getTripDate());
            dto.setStartTime(th.getStartTime());
            dto.setEndTime(th.getEndTime());
            dto.setStartKm(th.getStartKm());
            dto.setEndKm(th.getEndKm());
            dto.setTotalDistance(th.getTotalDistance() != null ? th.getTotalDistance() : 0.0);
            dto.setStudentCount(th.getStudentCount() != null ? th.getStudentCount() : 0);
            dto.setIsLateArrival(th.getIsLateArrival());
            dto.setStudentMarkedTime(th.getStudentMarkedTime());
            dto.setJourneyStatus(th.getJourneyStatus().name());

            // Gate Entry telemetry match
            Optional<BusEntry> entryOpt = busEntryRepository.findByBusIdAndEntryDate(th.getBus().getId(), th.getTripDate());
            if (entryOpt.isPresent()) {
                dto.setGateName(entryOpt.get().getGateName());
                dto.setGateEntryTime(entryOpt.get().getEntryTime());
            } else if (th.getBus().getAssignedGate() != null) {
                dto.setGateName(th.getBus().getAssignedGate().getGateName());
            }

            if (dto.getTotalDistance() != null) {
                totalDistance += dto.getTotalDistance();
            }
            if (dto.getStudentCount() != null) {
                totalStudents += dto.getStudentCount();
            }

            records.add(dto);
        }

        ReportSummaryDTO summary = new ReportSummaryDTO();
        summary.setFilterType(filter.getFilterType().name());
        summary.setPeriodLabel(periodLabel);
        summary.setTotalTrips((long) records.size());
        summary.setTotalDistance(Math.round(totalDistance * 100.0) / 100.0);
        summary.setTotalStudents(totalStudents);
        summary.setAvgDistancePerTrip(records.isEmpty() ? 0.0 : Math.round((totalDistance / records.size()) * 100.0) / 100.0);
        summary.setAvgStudentsPerTrip(records.isEmpty() ? 0.0 : Math.round(((double) totalStudents / records.size()) * 10.0) / 10.0);
        summary.setRecords(records);

        return summary;
    }

    // Backend Excel (.xlsx) generator
    public byte[] exportToExcel(ReportFilterDTO filter) throws IOException {
        ReportSummaryDTO report = generateReport(filter);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Transport Report");

            // Header Style
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);

            // Title Row
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("SMART COLLEGE TRANSPORT MANAGEMENT SYSTEM - " + report.getPeriodLabel().toUpperCase());

            // Summary Row
            Row sumRow = sheet.createRow(1);
            sumRow.createCell(0).setCellValue("Total Trips: " + report.getTotalTrips() +
                    " | Total Distance: " + report.getTotalDistance() + " KM" +
                    " | Total Students: " + report.getTotalStudents());

            // Column Headers
            String[] columns = {
                    "Bus No", "Registration No", "Route", "Driver Name", "Mobile",
                    "Gate", "Gate Entry Time", "Start Time", "End Time",
                    "Start KM", "End KM", "Distance (KM)", "Students", "Status"
            };

            Row headerRow = sheet.createRow(3);
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            // Data Rows
            int rowIdx = 4;
            for (TripHistoryDTO rowData : report.getRecords()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(rowData.getBusNumber() != null ? rowData.getBusNumber() : 0);
                row.createCell(1).setCellValue(rowData.getRegistrationNumber() != null ? rowData.getRegistrationNumber() : "");
                row.createCell(2).setCellValue(rowData.getRouteName() != null ? rowData.getRouteName() : "");
                row.createCell(3).setCellValue(rowData.getDriverName() != null ? rowData.getDriverName() : "");
                row.createCell(4).setCellValue(rowData.getDriverMobile() != null ? rowData.getDriverMobile() : "");
                row.createCell(5).setCellValue(rowData.getGateName() != null ? rowData.getGateName() : "-");
                row.createCell(6).setCellValue(rowData.getGateEntryTime() != null ? rowData.getGateEntryTime().toString() : "-");
                row.createCell(7).setCellValue(rowData.getStartTime() != null ? rowData.getStartTime().toString() : "-");
                row.createCell(8).setCellValue(rowData.getEndTime() != null ? rowData.getEndTime().toString() : "-");
                row.createCell(9).setCellValue(rowData.getStartKm() != null ? rowData.getStartKm() : 0.0);
                row.createCell(10).setCellValue(rowData.getEndKm() != null ? rowData.getEndKm() : 0.0);
                row.createCell(11).setCellValue(rowData.getTotalDistance() != null ? rowData.getTotalDistance() : 0.0);
                row.createCell(12).setCellValue(rowData.getStudentCount() != null ? rowData.getStudentCount() : 0);
                row.createCell(13).setCellValue(rowData.getJourneyStatus() != null ? rowData.getJourneyStatus() : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
