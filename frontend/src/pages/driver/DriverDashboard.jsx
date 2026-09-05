import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Bus,
  Play,
  CheckCircle2,
  Navigation,
  Gauge,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Camera,
  Sparkles
} from 'lucide-react';
import { driverService } from '../../services/driverService';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationToast } from '../../components/NotificationToast';
import { SpeedometerScannerModal } from '../../components/SpeedometerScannerModal';
import { motion } from 'framer-motion';

export const DriverDashboard = () => {
  const { t } = useLanguage();

  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  // Form inputs
  const [manualStartKm, setManualStartKm] = useState('');
  const [studentCountInput, setStudentCountInput] = useState('');
  const [endKmInput, setEndKmInput] = useState('');

  // Speedometer Scanner modal state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerField, setScannerField] = useState('Start KM');

  const handleDetectedKm = (kmValue) => {
    if (scannerField === 'Start KM') {
      setManualStartKm(String(kmValue));
      setToast({ open: true, message: `📷 Speedometer AI Scanned Start KM: ${kmValue} KM`, severity: 'success' });
    } else {
      setEndKmInput(String(kmValue));
      setToast({ open: true, message: `📷 Speedometer AI Scanned End KM: ${kmValue} KM`, severity: 'success' });
    }
  };

  // Loading states
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const [info, hist] = await Promise.all([
        driverService.getDriverBusInfo(),
        driverService.getTripHistory()
      ]);
      setBusInfo(info);
      setHistory(hist || []);

      if (info?.studentCount != null && info.studentCount > 0) {
        setStudentCountInput(String(info.studentCount));
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load driver bus console');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  // Step 1: Start Journey
  const handleStartJourney = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setActionLoading(true);

    try {
      const km = manualStartKm ? parseFloat(manualStartKm) : null;
      const updated = await driverService.startJourney(km);
      if (updated) {
        setBusInfo(updated);
      }
      setToast({ open: true, message: '🚀 Journey started! Start Time logged.', severity: 'success' });
      fetchDriverData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to start journey');
    } finally {
      setActionLoading(false);
    }
  };

  // Step 2: College Arrival - Save Student Count
  const handleSaveStudents = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const count = parseInt(studentCountInput, 10);
    if (isNaN(count) || count < 0) {
      setErrorMsg('Please enter a valid student count');
      return;
    }

    setActionLoading(true);
    try {
      const updated = await driverService.saveStudentCount(count);
      setBusInfo(updated);
      setToast({ open: true, message: `✅ Saved student count: ${count} students on board`, severity: 'success' });
      fetchDriverData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save student count');
    } finally {
      setActionLoading(false);
    }
  };

  // Step 3: End Journey (End KM entered, Distance auto calculated)
  const handleEndJourney = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const endKm = parseFloat(endKmInput);
    if (isNaN(endKm) || endKm < 0) {
      setErrorMsg('Please enter a valid End KM reading');
      return;
    }

    if (busInfo?.startKm != null && endKm < busInfo.startKm) {
      setErrorMsg(`Validation Error: End KM (${endKm}) cannot be smaller than Start KM (${busInfo.startKm})`);
      return;
    }

    setActionLoading(true);
    try {
      const updated = await driverService.endJourney(endKm);
      setBusInfo(updated);
      setToast({
        open: true,
        message: `🏁 Journey Completed! Total Distance: ${updated.totalDistance} KM`,
        severity: 'success'
      });
      fetchDriverData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to end journey');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  const journeyStatus = busInfo?.journeyStatus || 'NOT_STARTED';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Banner: Assigned Bus & Route Details */}
      <Card
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          p: { xs: 2.5, sm: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3.5,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Bus size={32} />
            </Box>

            <Box>
              <Typography variant="overline" sx={{ color: '#34d399', fontWeight: 800, letterSpacing: '0.1em' }}>
                {t('driver.assignedBus').toUpperCase()}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Bus #{busInfo?.busNumber}
              </Typography>
              <Typography variant="body2" sx={{ color: '#60a5fa', fontWeight: 700 }}>
                {busInfo?.registrationNumber} • {t('driver.route')}: {busInfo?.routeName || 'Campus Shuttle'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={
                journeyStatus === 'COMPLETED'
                  ? t('driver.statusCompleted')
                  : journeyStatus === 'COLLEGE_ARRIVED'
                  ? t('driver.statusArrived')
                  : journeyStatus === 'IN_TRANSIT'
                  ? t('driver.statusInTransit')
                  : t('driver.statusNotStarted')
              }
              color={
                journeyStatus === 'COMPLETED'
                  ? 'success'
                  : journeyStatus === 'IN_TRANSIT'
                  ? 'info'
                  : journeyStatus === 'COLLEGE_ARRIVED'
                  ? 'warning'
                  : 'default'
              }
              sx={{ fontWeight: 800, borderRadius: 2.5, px: 1, py: 2.2, fontSize: '0.9rem' }}
            />
          </Box>
        </Box>
      </Card>

      {errorMsg && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Dynamic Journey Workflow Cards */}
      <Grid container spacing={3}>
        {/* STEP 1: START JOURNEY */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: journeyStatus === 'NOT_STARTED' ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
              opacity: journeyStatus !== 'NOT_STARTED' ? 0.7 : 1,
              p: 2.5
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                  <Play size={20} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  1. {t('driver.startJourneyBtn')}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                {busInfo?.isAutoStartKm ? t('driver.autoKmNote') : t('driver.manualKmNote')}
              </Typography>

              {/* Start KM display / input */}
              <Box sx={{ mb: 2.5 }}>
                {busInfo?.isAutoStartKm && !manualStartKm ? (
                  <Box sx={{ p: 2, mb: 1.5, borderRadius: 3, backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                      {t('driver.startKmLabel')} (Auto-loaded from last trip)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#60a5fa' }}>
                      {busInfo.startKm} KM
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    type="number"
                    label={t('driver.startKmLabel')}
                    value={manualStartKm || busInfo?.startKm || ''}
                    onChange={(e) => setManualStartKm(e.target.value)}
                    disabled={journeyStatus !== 'NOT_STARTED'}
                    placeholder="Enter current odometer KM"
                    helperText="Enter or scan vehicle Start KM"
                    sx={{ mb: 1.5 }}
                  />
                )}

                {journeyStatus === 'NOT_STARTED' && (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="info"
                    size="small"
                    startIcon={<Camera size={16} />}
                    onClick={() => {
                      setScannerField('Start KM');
                      setScannerOpen(true);
                    }}
                    sx={{ borderRadius: 2.5, fontWeight: 800, borderStyle: 'dashed' }}
                  >
                    📷 Scan Speedometer Photo (AI OCR)
                  </Button>
                )}
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleStartJourney}
                disabled={actionLoading || journeyStatus !== 'NOT_STARTED' || (!busInfo?.isAutoStartKm && !manualStartKm)}
                startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <Play size={20} />}
                sx={{ py: 1.3, fontWeight: 800, borderRadius: 3 }}
              >
                {journeyStatus === 'NOT_STARTED' ? t('driver.startJourneyBtn') : 'Started'}
              </Button>

              {busInfo?.startTime && (
                <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700, display: 'block', mt: 1.5, textAlign: 'center' }}>
                  ✓ Started at {String(busInfo.startTime).substring(0, 5)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* STEP 2: COLLEGE ARRIVAL & STUDENT COUNT (ONLY AFTER GATE ENTRY) */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: (journeyStatus === 'IN_TRANSIT' || journeyStatus === 'COLLEGE_ARRIVED')
                ? (busInfo?.isLateArrival ? '2px solid #ef4444' : '2px solid #f59e0b')
                : '1px solid rgba(255, 255, 255, 0.08)',
              opacity: (journeyStatus === 'NOT_STARTED' || journeyStatus === 'COMPLETED') ? 0.7 : 1,
              p: 2.5
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                    <Users size={20} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                    2. {t('driver.collegeArrivalTitle')}
                  </Typography>
                </Box>

                {busInfo?.isLateArrival && (
                  <Chip
                    label="🔴 LATE (>10 AM)"
                    size="small"
                    color="error"
                    sx={{ fontWeight: 800, borderRadius: 2 }}
                  />
                )}
              </Box>

              {/* Gate Entry Prerequisite Banner */}
              {busInfo?.gateEntryRecorded ? (
                <Box sx={{ p: 1.5, mb: 2, borderRadius: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 800, display: 'block' }}>
                    ✅ Gate Checkpoint Confirmed
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                    Bus entered <strong>{busInfo.gateName}</strong> at <strong>{String(busInfo.gateEntryTime).substring(0, 5)}</strong>.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 1.5, mb: 2, borderRadius: 2.5, backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                  <Typography variant="caption" sx={{ color: '#f87171', fontWeight: 800, display: 'block' }}>
                    ⛔ Gate Entry Pending
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#fca5a5' }}>
                    Security has not yet recorded Bus #{busInfo?.busNumber} at the gate. Student count unlocks only after gate entry.
                  </Typography>
                </Box>
              )}

              {/* Time Window Notice (08:30 AM – 10:00 AM) */}
              <Box sx={{ p: 1.2, mb: 2, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  🕒 Allowed Arrival Window: <strong>08:30 AM – 10:00 AM</strong>
                </Typography>
                {new Date().getHours() >= 10 && (
                  <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700, display: 'block', mt: 0.3 }}>
                    ⚠️ Late Submission (&gt;10:00 AM): Record will be flagged in RED.
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('driver.enterStudents')}
                  value={studentCountInput}
                  onChange={(e) => setStudentCountInput(e.target.value)}
                  disabled={!busInfo?.gateEntryRecorded || journeyStatus === 'NOT_STARTED' || journeyStatus === 'COMPLETED' || (busInfo?.studentCount != null && busInfo.studentCount > 0)}
                  placeholder={
                    (busInfo?.studentCount != null && busInfo.studentCount > 0)
                      ? "🔒 Locked (Submitted)"
                      : busInfo?.gateEntryRecorded
                      ? "e.g. 54"
                      : "Locked until Security Gate entry"
                  }
                  helperText={
                    (busInfo?.studentCount != null && busInfo.studentCount > 0)
                      ? "🔒 Student count confirmed and locked for today's trip"
                      : !busInfo?.gateEntryRecorded
                      ? "Waiting for Security to press 'Bus Enter' at gate"
                      : "Enter count of students transported"
                  }
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                color={busInfo?.isLateArrival ? "error" : "warning"}
                size="large"
                onClick={handleSaveStudents}
                disabled={actionLoading || !busInfo?.gateEntryRecorded || journeyStatus === 'NOT_STARTED' || journeyStatus === 'COMPLETED' || !studentCountInput || (busInfo?.studentCount != null && busInfo.studentCount > 0)}
                startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <Check size={20} />}
                sx={{ py: 1.3, fontWeight: 800, borderRadius: 3 }}
              >
                {(busInfo?.studentCount != null && busInfo.studentCount > 0)
                  ? "🔒 Submitted & Locked"
                  : t('driver.saveStudentsBtn')}
              </Button>

              {busInfo?.studentCount != null && busInfo.studentCount > 0 && (
                <Box sx={{ mt: 1.5, p: 1.2, borderRadius: 2.5, backgroundColor: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.3)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: busInfo.isLateArrival ? '#ef4444' : '#fbbf24', fontWeight: 800, display: 'block' }}>
                    🔒 {busInfo.studentCount} {t('common.students')} Submitted & Locked {busInfo.isLateArrival ? '(🔴 LATE RECORD)' : ''}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* STEP 3: END JOURNEY & DISTANCE CALCULATION */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: (journeyStatus === 'COLLEGE_ARRIVED' || journeyStatus === 'IN_TRANSIT') ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
              p: 2.5
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                  <Gauge size={20} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  3. {t('driver.endJourneyTitle')}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                {t('driver.endKmValidation')}. Distance = End KM - Start KM.
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('driver.enterEndKm')}
                  value={endKmInput}
                  onChange={(e) => setEndKmInput(e.target.value)}
                  disabled={journeyStatus === 'NOT_STARTED' || journeyStatus === 'COMPLETED'}
                  placeholder={busInfo?.startKm ? `Must be >= ${busInfo.startKm}` : 'Enter End KM'}
                  sx={{ mb: 1.5 }}
                />
                {journeyStatus !== 'NOT_STARTED' && journeyStatus !== 'COMPLETED' && (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="info"
                    size="small"
                    startIcon={<Camera size={16} />}
                    onClick={() => {
                      setScannerField('End KM');
                      setScannerOpen(true);
                    }}
                    sx={{ borderRadius: 2.5, fontWeight: 800, borderStyle: 'dashed' }}
                  >
                    📷 Scan Speedometer Photo (AI OCR)
                  </Button>
                )}
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                onClick={handleEndJourney}
                disabled={actionLoading || journeyStatus === 'NOT_STARTED' || journeyStatus === 'COMPLETED' || !endKmInput}
                startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle2 size={20} />}
                sx={{ py: 1.3, fontWeight: 800, borderRadius: 3 }}
              >
                {journeyStatus === 'COMPLETED' ? 'Completed' : t('driver.endJourneyBtn')}
              </Button>

              {busInfo?.totalDistance != null && busInfo.totalDistance > 0 && (
                <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.1)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 800, display: 'block' }}>
                    🎉 Total Distance: {busInfo.totalDistance} KM
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Driver Trip History Table */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', mb: 2 }}>
          {t('driver.tripHistory')}
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Bus No</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Gate & Time</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Start KM</TableCell>
                <TableCell>End KM</TableCell>
                <TableCell>Total Distance</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Arrival Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    No trip history logged yet.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((t) => {
                  const isLate = t.isLateArrival;
                  return (
                    <TableRow
                      key={t.id}
                      hover
                      sx={{
                        backgroundColor: isLate ? 'rgba(239, 68, 68, 0.12) !important' : 'inherit',
                        borderLeft: isLate ? '4px solid #ef4444' : 'none'
                      }}
                    >
                      <TableCell sx={{ color: isLate ? '#f87171' : '#cbd5e1', fontWeight: 600 }}>{t.tripDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={`Bus #${t.busNumber}`}
                          color={isLate ? 'error' : 'primary'}
                          size="small"
                          sx={{ fontWeight: 800, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: isLate ? '#fca5a5' : '#f8fafc', fontWeight: 700 }}>{t.routeName}</TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>
                        {t.gateName || '-'} {t.gateEntryTime ? `(${String(t.gateEntryTime).substring(0, 5)})` : ''}
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>{t.startTime ? String(t.startTime).substring(0, 5) : '-'}</TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>{t.endTime ? String(t.endTime).substring(0, 5) : '-'}</TableCell>
                      <TableCell sx={{ color: '#fbbf24', fontWeight: 600 }}>{t.startKm ?? '-'}</TableCell>
                      <TableCell sx={{ color: '#fbbf24', fontWeight: 600 }}>{t.endKm ?? '-'}</TableCell>
                      <TableCell sx={{ color: '#34d399', fontWeight: 800 }}>
                        {t.totalDistance != null ? `${t.totalDistance} KM` : '-'}
                      </TableCell>
                      <TableCell sx={{ color: isLate ? '#ef4444' : '#60a5fa', fontWeight: 800 }}>
                        {t.studentCount ?? 0}
                      </TableCell>
                      <TableCell>
                        {isLate ? (
                          <Chip
                            label="🔴 LATE ARRIVAL"
                            size="small"
                            color="error"
                            sx={{ fontWeight: 800, borderRadius: 2 }}
                          />
                        ) : (
                          <Chip
                            label={t.journeyStatus}
                            size="small"
                            color={t.journeyStatus === 'COMPLETED' ? 'success' : t.journeyStatus === 'IN_TRANSIT' ? 'info' : 'default'}
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
        </TableContainer>
      </Box>

      {/* Speedometer AI OCR Scanner Modal */}
      <SpeedometerScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetectedKm={handleDetectedKm}
        fieldName={scannerField}
      />

      <NotificationToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};
