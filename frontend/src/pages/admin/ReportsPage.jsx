import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  ButtonGroup,
  Divider,
  InputAdornment,
  TablePagination
} from '@mui/material';
import { FileText, Download, FileSpreadsheet, Search, Calendar, Filter, RefreshCw, Bus, Users, Gauge } from 'lucide-react';
import { reportService } from '../../services/reportService';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { StatCard } from '../../components/StatCard';
import { NotificationToast } from '../../components/NotificationToast';

export const ReportsPage = () => {
  const { t } = useLanguage();

  const [filterType, setFilterType] = useState('DAILY');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedBusNumber, setSelectedBusNumber] = useState('');

  const [routes, setRoutes] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    adminService.getRoutes().then((data) => setRoutes(data || [])).catch(() => {});
    fetchReport();
  }, [filterType]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const payload = {
        filterType,
        startDate: filterType === 'DAILY' ? startDate : undefined,
        endDate: filterType === 'CUSTOM' ? endDate : undefined,
        routeId: selectedRouteId ? parseInt(selectedRouteId, 10) : undefined,
        busNumber: selectedBusNumber ? parseInt(selectedBusNumber, 10) : undefined
      };

      const data = await reportService.getReport(payload);
      setReport(data);
      setPage(0);
    } catch (err) {
      setToast({ open: true, message: 'Failed to generate report', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!report || !report.records || report.records.length === 0) {
      setToast({ open: true, message: 'No records available to export', severity: 'warning' });
      return;
    }
    reportService.exportToPdfClient(report);
    setToast({ open: true, message: 'PDF Export generated successfully', severity: 'success' });
  };

  const handleExportExcel = () => {
    if (!report || !report.records || report.records.length === 0) {
      setToast({ open: true, message: 'No records available to export', severity: 'warning' });
      return;
    }
    reportService.exportToExcelClient(report);
    setToast({ open: true, message: 'Excel (.xlsx) generated successfully', severity: 'success' });
  };

  const filteredRecords = (report?.records || []).filter((r) =>
    String(r.busNumber).includes(searchTerm) ||
    (r.routeName && r.routeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.driverName && r.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.gateName && r.gateName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#fff'
            }}
          >
            <FileText size={24} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {t('reports.title')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Daily, Weekly, and Monthly Telemetry with PDF & Excel Export
            </Typography>
          </Box>
        </Box>

        {/* Action Export Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<FileSpreadsheet size={18} />}
            onClick={handleExportExcel}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {t('reports.exportExcel')}
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<Download size={18} />}
            onClick={handleExportPdf}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {t('reports.exportPdf')}
          </Button>
        </Box>
      </Box>

      {/* Filter Control Card */}
      <Card sx={{ p: 2.5, borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
        <Grid container spacing={2} alignItems="center">
          {/* Preset Buttons */}
          <Grid item xs={12} md={4}>
            <ButtonGroup variant="outlined" sx={{ width: '100%' }}>
              {['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'contained' : 'outlined'}
                  onClick={() => setFilterType(type)}
                  sx={{ flex: 1, fontWeight: 700, borderRadius: 2 }}
                >
                  {type === 'DAILY' ? t('reports.daily') : type === 'WEEKLY' ? t('reports.weekly') : type === 'MONTHLY' ? t('reports.monthly') : t('reports.custom')}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>

          {/* Date selector */}
          {filterType === 'DAILY' && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                size="small"
                label={t('reports.selectDate')}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}

          {filterType === 'CUSTOM' && (
            <>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="From Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="To Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}

          {/* Route filter */}
          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              fullWidth
              select
              size="small"
              label="Filter Route"
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
            >
              <MenuItem value="">
                <em>All Routes</em>
              </MenuItem>
              {routes.map((r) => (
                <MenuItem key={r.id} value={String(r.id)}>
                  {r.routeName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Refresh/Query Button */}
          <Grid item xs={12} sm={6} md={1.5}>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchReport}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshCw size={16} />}
              sx={{ borderRadius: 2.5, height: 40 }}
            >
              Query
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Summary KPI Cards */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('reports.totalTrips')}
            value={report?.totalTrips ?? 0}
            icon={<Bus size={22} />}
            color="#3b82f6"
            subtitle={report?.periodLabel}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('reports.totalKm')}
            value={`${report?.totalDistance ?? 0} KM`}
            icon={<Gauge size={22} />}
            color="#10b981"
            subtitle={`Avg: ${report?.avgDistancePerTrip ?? 0} KM/trip`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('reports.totalStudents')}
            value={report?.totalStudents ?? 0}
            icon={<Users size={22} />}
            color="#f59e0b"
            subtitle={`Avg: ${report?.avgStudentsPerTrip ?? 0} / trip`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Fleet Distance"
            value={`${report?.avgDistancePerTrip ?? 0} KM`}
            icon={<Filter size={22} />}
            color="#8b5cf6"
            subtitle="Efficiency Metric"
          />
        </Grid>
      </Grid>

      {/* Search in Report */}
      <Card sx={{ p: 2, borderRadius: 3.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Filter report records by Bus #, Route, Driver, or Gate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#94a3b8" />
              </InputAdornment>
            )
          }}
        />
      </Card>

      {/* Report Data Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Bus No</TableCell>
                  <TableCell>Plate Reg</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Driver Name</TableCell>
                  <TableCell>Gate & Entry Time</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Start KM</TableCell>
                  <TableCell>End KM</TableCell>
                  <TableCell>Distance</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                      {t('reports.noRecords')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => {
                    const isLate = r.isLateArrival;
                    return (
                      <TableRow
                        key={r.id}
                        hover
                        sx={{
                          backgroundColor: isLate ? 'rgba(239, 68, 68, 0.12) !important' : 'inherit',
                          borderLeft: isLate ? '4px solid #ef4444' : 'none'
                        }}
                      >
                        <TableCell>
                          <Chip
                            label={`Bus #${r.busNumber}`}
                            color={isLate ? "error" : "primary"}
                            size="small"
                            sx={{ fontWeight: 800, borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: isLate ? '#fca5a5' : '#f8fafc', fontWeight: 600 }}>
                          {r.registrationNumber}
                        </TableCell>
                        <TableCell sx={{ color: isLate ? '#fca5a5' : '#cbd5e1' }}>
                          {r.routeName}
                        </TableCell>
                        <TableCell sx={{ color: isLate ? '#f87171' : '#f8fafc', fontWeight: 700 }}>
                          {r.driverName}
                          {r.driverMobile && (
                            <Typography variant="caption" sx={{ color: isLate ? '#fca5a5' : '#94a3b8', display: 'block' }}>
                              📱 {r.driverMobile}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: isLate ? '#fca5a5' : '#cbd5e1' }}>
                          {r.gateName || '-'} {r.gateEntryTime ? `(${String(r.gateEntryTime).substring(0, 5)})` : ''}
                        </TableCell>
                        <TableCell sx={{ color: '#cbd5e1' }}>
                          {r.startTime ? String(r.startTime).substring(0, 5) : '-'}
                        </TableCell>
                        <TableCell sx={{ color: '#cbd5e1' }}>
                          {r.endTime ? String(r.endTime).substring(0, 5) : '-'}
                        </TableCell>
                        <TableCell sx={{ color: '#fbbf24', fontWeight: 600 }}>
                          {r.startKm ?? '-'}
                        </TableCell>
                        <TableCell sx={{ color: '#fbbf24', fontWeight: 600 }}>
                          {r.endKm ?? '-'}
                        </TableCell>
                        <TableCell sx={{ color: '#34d399', fontWeight: 800 }}>
                          {r.totalDistance != null ? `${r.totalDistance} KM` : '-'}
                        </TableCell>
                        <TableCell sx={{ color: isLate ? '#ef4444' : '#60a5fa', fontWeight: 900, fontSize: '0.95rem' }}>
                          {r.studentCount ?? 0} {isLate ? '⚠️' : ''}
                        </TableCell>
                        <TableCell>
                          {isLate ? (
                            <Chip
                              label="🔴 LATE (>10 AM)"
                              size="small"
                              color="error"
                              sx={{ fontWeight: 800, borderRadius: 2 }}
                            />
                          ) : (
                            <Chip
                              label={r.journeyStatus}
                              size="small"
                              color={r.journeyStatus === 'COMPLETED' ? 'success' : r.journeyStatus === 'IN_TRANSIT' ? 'info' : 'default'}
                              sx={{ fontWeight: 700, borderRadius: 2 }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredRecords.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              sx={{ color: '#94a3b8' }}
            />
          </>
        )}
      </TableContainer>

      <NotificationToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};
