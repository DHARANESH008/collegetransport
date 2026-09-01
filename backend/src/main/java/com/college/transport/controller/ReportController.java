package com.college.transport.controller;

import com.college.transport.dto.ApiResponse;
import com.college.transport.dto.ReportFilterDTO;
import com.college.transport.dto.ReportSummaryDTO;
import com.college.transport.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SECURITY', 'ROLE_DRIVER')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/query")
    public ResponseEntity<ApiResponse<ReportSummaryDTO>> getReport(@RequestBody(required = false) ReportFilterDTO filter) {
        if (filter == null) {
            filter = new ReportFilterDTO();
        }
        ReportSummaryDTO report = reportService.generateReport(filter);
        return ResponseEntity.ok(ApiResponse.ok("Report generated successfully", report));
    }

    @PostMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel(@RequestBody(required = false) ReportFilterDTO filter) throws IOException {
        if (filter == null) {
            filter = new ReportFilterDTO();
        }
        byte[] excelBytes = reportService.exportToExcel(filter);

        String filename = "Transport_Report_" + LocalDate.now() + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }
}
