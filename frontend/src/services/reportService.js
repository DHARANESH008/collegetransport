import api from './api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const reportService = {
  getReport: async (filter) => {
    const response = await api.post('/reports/query', filter);
    return response.data.data;
  },

  exportToExcelClient: (report) => {
    const worksheetData = [
      ['SMART COLLEGE TRANSPORT MANAGEMENT SYSTEM - ' + (report.periodLabel || 'REPORT').toUpperCase()],
      [`Generated on: ${new Date().toLocaleString()} | Total Trips: ${report.totalTrips || 0} | Total Distance: ${report.totalDistance || 0} KM | Total Students: ${report.totalStudents || 0}`],
      [],
      [
        'Bus No',
        'Plate Reg No',
        'Route',
        'Driver Name',
        'Driver Mobile',
        'Gate',
        'Gate Entry Time',
        'Journey Start Time',
        'Journey End Time',
        'Start KM',
        'End KM',
        'Distance (KM)',
        'Students',
        'Status'
      ]
    ];

    if (report.records && report.records.length > 0) {
      report.records.forEach((r) => {
        worksheetData.push([
          r.busNumber ?? '-',
          r.registrationNumber ?? '-',
          r.routeName ?? '-',
          r.driverName ?? '-',
          r.driverMobile ?? '-',
          r.gateName ?? '-',
          r.gateEntryTime ?? '-',
          r.startTime ?? '-',
          r.endTime ?? '-',
          r.startKm ?? 0,
          r.endKm ?? 0,
          r.totalDistance ?? 0,
          r.studentCount ?? 0,
          r.journeyStatus ?? '-'
        ]);
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transport Report');
    XLSX.writeFile(wb, `College_Transport_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportToPdfClient: (report) => {
    const doc = new jsPDF('landscape', 'pt', 'a4');

    // Header Background banner
    doc.setFillColor(11, 19, 43); // Dark Navy #0b132b
    doc.rect(0, 0, 842, 65, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SMART COLLEGE TRANSPORT MANAGEMENT SYSTEM', 40, 28);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`Official Telemetry & Trip Report • ${report.periodLabel || 'All Records'}`, 40, 46);

    // Summary Card on PDF
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(40, 75, 762, 35, 6, 6, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);

    const summaryText = `Total Trips: ${report.totalTrips || 0}   |   Total Distance: ${report.totalDistance || 0} KM   |   Total Students: ${report.totalStudents || 0}   |   Avg Dist/Trip: ${report.avgDistancePerTrip || 0} KM`;
    doc.text(summaryText, 50, 96);

    // Table Data
    const tableHeaders = [
      ['Bus', 'Plate Reg', 'Route', 'Driver', 'Mobile', 'Gate', 'Entry', 'Start', 'End', 'Start KM', 'End KM', 'Dist', 'Students', 'Status']
    ];

    const tableRows = (report.records || []).map((r) => [
      `#${r.busNumber ?? '-'}`,
      r.registrationNumber ?? '-',
      r.routeName ?? '-',
      r.driverName ?? '-',
      r.driverMobile ?? '-',
      r.gateName ?? '-',
      r.gateEntryTime ? String(r.gateEntryTime).substring(0, 5) : '-',
      r.startTime ? String(r.startTime).substring(0, 5) : '-',
      r.endTime ? String(r.endTime).substring(0, 5) : '-',
      r.startKm ?? '-',
      r.endKm ?? '-',
      `${r.totalDistance ?? 0} KM`,
      r.studentCount ?? 0,
      r.journeyStatus ?? '-'
    ]);

    doc.autoTable({
      head: tableHeaders,
      body: tableRows,
      startY: 120,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      styles: {
        cellPadding: 4,
        valign: 'middle'
      },
      margin: { left: 40, right: 40 }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated on ${new Date().toLocaleString()} • Page ${i} of ${pageCount} • Smart College Transport ERP`, 40, 575);
    }

    doc.save(`College_Transport_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
};
