import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import { UserCheck, Bus, ShieldCheck, DoorOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationToast } from '../../components/NotificationToast';

export const AssignmentsPage = () => {
  const { t } = useLanguage();

  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [securityStaff, setSecurityStaff] = useState([]);
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Driver -> Bus form
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedBusId, setSelectedBusId] = useState('');
  const [submittingDriver, setSubmittingDriver] = useState(false);

  // Security -> Gate form
  const [selectedSecurityId, setSelectedSecurityId] = useState('');
  const [selectedGateId, setSelectedGateId] = useState('');
  const [submittingSecurity, setSubmittingSecurity] = useState(false);

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [drvList, busList, secList, gtList] = await Promise.all([
        adminService.getDrivers(),
        adminService.getBuses(),
        adminService.getSecurityStaff(),
        adminService.getGates()
      ]);
      setDrivers(drvList || []);
      setBuses(busList || []);
      setSecurityStaff(secList || []);
      setGates(gtList || []);

      if (drvList?.length > 0) setSelectedDriverId(String(drvList[0].id));
      if (busList?.length > 0) setSelectedBusId(String(busList[0].id));
      if (secList?.length > 0) setSelectedSecurityId(String(secList[0].id));
      if (gtList?.length > 0) setSelectedGateId(String(gtList[0].id));
    } catch (err) {
      setToast({ open: true, message: 'Failed to load assignment data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignDriver = async (e) => {
    e.preventDefault();
    if (!selectedDriverId || !selectedBusId) return;

    setSubmittingDriver(true);
    try {
      await adminService.assignDriverToBus(parseInt(selectedDriverId, 10), parseInt(selectedBusId, 10));
      const drv = drivers.find((d) => d.id === parseInt(selectedDriverId, 10));
      const bus = buses.find((b) => b.id === parseInt(selectedBusId, 10));
      setToast({
        open: true,
        message: `Assigned Driver "${drv?.name}" ➔ Bus #${bus?.busNumber} (${bus?.routeName || 'Route'})`,
        severity: 'success'
      });
      fetchData();
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || 'Assignment failed', severity: 'error' });
    } finally {
      setSubmittingDriver(false);
    }
  };

  const handleAssignSecurity = async (e) => {
    e.preventDefault();
    if (!selectedSecurityId || !selectedGateId) return;

    setSubmittingSecurity(true);
    try {
      await adminService.assignSecurityToGate(parseInt(selectedSecurityId, 10), parseInt(selectedGateId, 10));
      const sec = securityStaff.find((s) => s.id === parseInt(selectedSecurityId, 10));
      const gate = gates.find((g) => g.id === parseInt(selectedGateId, 10));
      setToast({
        open: true,
        message: `Assigned Security "${sec?.name}" ➔ ${gate?.gateName}`,
        severity: 'success'
      });
      fetchData();
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || 'Assignment failed', severity: 'error' });
    } finally {
      setSubmittingSecurity(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            p: 1.2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#fff'
          }}
        >
          <UserCheck size={24} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
            {t('nav.assignments')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            1-to-1 Driver & Bus Mapping • 1-to-1 Security & Gate Mapping
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Module 1: Driver <-> Bus Assignment */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              p: 2.5
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2.5,
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa'
                  }}
                >
                  <Bus size={20} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  {t('masters.assignDriverTitle')}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                Assign 1 Driver to 1 Bus. The driver will automatically load this bus and its route upon login.
              </Typography>

              <Box component="form" onSubmit={handleAssignDriver} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth
                  select
                  label="Select Driver"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  required
                >
                  {drivers.map((d) => (
                    <MenuItem key={d.id} value={String(d.id)}>
                      {d.name} (@{d.username}) {d.assignedBusNumber ? `• Currently Bus #${d.assignedBusNumber}` : '• (Unassigned)'}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Select Bus (0–150)"
                  value={selectedBusId}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  required
                >
                  {buses.map((b) => (
                    <MenuItem key={b.id} value={String(b.id)}>
                      Bus #{b.busNumber} ({b.registrationNumber}) • Route: {b.routeName || 'N/A'} {b.assignedDriverName ? `• Assigned to ${b.assignedDriverName}` : ''}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submittingDriver || !selectedDriverId || !selectedBusId}
                  endIcon={submittingDriver ? <CircularProgress size={18} color="inherit" /> : <ArrowRight size={18} />}
                  sx={{ py: 1.3, fontWeight: 700, borderRadius: 3 }}
                >
                  Confirm Driver Assignment
                </Button>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 3 }} />

              {/* Current Active Driver Assignments List */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#cbd5e1', mb: 1.5 }}>
                Active Driver Assignments:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {drivers.filter((d) => d.assignedBusNumber != null).map((d) => (
                  <Box
                    key={d.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                        {d.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        📱 {d.mobileNumber}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<Bus size={14} />}
                      label={`Bus #${d.assignedBusNumber} (${d.assignedRouteName || 'Route'})`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Module 2: Security <-> Gate Assignment */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              p: 2.5
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2.5,
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24'
                  }}
                >
                  <DoorOpen size={20} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  {t('masters.assignSecurityTitle')}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                Assign 1 Security Staff to 1 Gate. Upon login, only the Gate Name will be loaded on the terminal.
              </Typography>

              <Box component="form" onSubmit={handleAssignSecurity} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth
                  select
                  label="Select Security Staff"
                  value={selectedSecurityId}
                  onChange={(e) => setSelectedSecurityId(e.target.value)}
                  required
                >
                  {securityStaff.map((s) => (
                    <MenuItem key={s.id} value={String(s.id)}>
                      {s.name} (@{s.username}) {s.assignedGateName ? `• Currently ${s.assignedGateName}` : '• (Unassigned)'}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Select Campus Gate"
                  value={selectedGateId}
                  onChange={(e) => setSelectedGateId(e.target.value)}
                  required
                >
                  {gates.map((g) => (
                    <MenuItem key={g.id} value={String(g.id)}>
                      {g.gateName} {g.description ? `• ${g.description}` : ''}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  size="large"
                  disabled={submittingSecurity || !selectedSecurityId || !selectedGateId}
                  endIcon={submittingSecurity ? <CircularProgress size={18} color="inherit" /> : <ArrowRight size={18} />}
                  sx={{ py: 1.3, fontWeight: 700, borderRadius: 3 }}
                >
                  Confirm Gate Assignment
                </Button>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 3 }} />

              {/* Current Active Security Assignments List */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#cbd5e1', mb: 1.5 }}>
                Active Security Assignments:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {securityStaff.filter((s) => s.assignedGateName != null).map((s) => (
                  <Box
                    key={s.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                        {s.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        @{s.username} • 📱 {s.mobileNumber}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<DoorOpen size={14} />}
                      label={s.assignedGateName}
                      color="warning"
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <NotificationToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};
