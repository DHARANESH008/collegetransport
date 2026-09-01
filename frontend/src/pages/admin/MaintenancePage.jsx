import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Database, Play, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationToast } from '../../components/NotificationToast';

export const MaintenancePage = () => {
  const { t } = useLanguage();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCleanupLogs();
      setLogs(data || []);
    } catch (err) {
      setToast({ open: true, message: 'Failed to fetch maintenance logs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRunCleanup = async () => {
    setTriggering(true);
    try {
      const res = await adminService.triggerCleanupNow();
      setToast({
        open: true,
        message: res.message || '3-Month Data Retention cleanup completed successfully',
        severity: 'success'
      });
      fetchLogs();
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || 'Cleanup trigger failed', severity: 'error' });
    } finally {
      setTriggering(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            p: 1.2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            color: '#fff'
          }}
        >
          <Database size={24} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
            {t('maintenance.title')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Automated 3-Month Database Retention & Transient Data Purge Engine
          </Typography>
        </Box>
      </Box>

      {/* Policy Card */}
      <Card
        sx={{
          borderRadius: 4,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          p: 3
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ maxWidth: 700 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircle2 size={18} color="#10b981" />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  Automatic 90-Day (3-Month) Data Lifecycle Active
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                {t('maintenance.policyDesc')}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label="Target Tables: bus_entries, trip_histories"
                  size="small"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#60a5fa', fontWeight: 600 }}
                />
                <Chip
                  label="Master Tables: Permanently Preserved"
                  size="small"
                  sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 600 }}
                />
                <Chip
                  label="Scheduled Cron: Daily 00:00:00 (Midnight)"
                  size="small"
                  sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontWeight: 600 }}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              color="info"
              size="large"
              onClick={handleRunCleanup}
              disabled={triggering}
              startIcon={triggering ? <CircularProgress size={18} color="inherit" /> : <Play size={18} />}
              sx={{ borderRadius: 3, fontWeight: 700, px: 3 }}
            >
              {triggering ? 'Purging Old Records...' : t('maintenance.runNow')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', mb: 2 }}>
          {t('maintenance.logsTitle')}
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
          {loading ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <CircularProgress size={36} />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Execution Timestamp</TableCell>
                  <TableCell>Cutoff Date (90 Days Prior)</TableCell>
                  <TableCell>Gate Entries Purged</TableCell>
                  <TableCell>Trip Histories Purged</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Log Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                      No cleanup executions logged yet. The automated midnight scheduler or manual trigger will record logs here.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Clock size={14} color="#94a3b8" />
                          {new Date(log.cleanupTimestamp).toLocaleString()}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#fbbf24', fontWeight: 700 }}>
                        {log.cutoffDate}
                      </TableCell>
                      <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>
                        {log.busEntriesDeleted} records
                      </TableCell>
                      <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>
                        {log.tripHistoriesDeleted} records
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          size="small"
                          color={log.status === 'SUCCESS' ? 'success' : 'error'}
                          sx={{ fontWeight: 800, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {log.message}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>

      <NotificationToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};
