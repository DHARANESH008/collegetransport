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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { ShieldAlert, DoorOpen, Plus, Edit, Search, Clock, CheckCircle2, AlertTriangle, Bus, LogOut, ArrowRightLeft } from 'lucide-react';
import { securityService } from '../../services/securityService';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationToast } from '../../components/NotificationToast';
import { motion } from 'framer-motion';

export const SecurityDashboard = () => {
  const { t } = useLanguage();

  const [gateInfo, setGateInfo] = useState(null);
  const [buses, setBuses] = useState([]);
  const [busSearchInput, setBusSearchInput] = useState('');
  const [selectedBusNumber, setSelectedBusNumber] = useState('');
  const [entries, setEntries] = useState([]);
  const [outings, setOutings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mode Tab: 'GATE_IN' vs 'GATE_OUT'
  const [movementMode, setMovementMode] = useState('GATE_IN');

  // Outing Reason state
  const [reasonCategory, setReasonCategory] = useState('Diesel Fill');
  const [customReason, setCustomReason] = useState('');

  // Edit Modal State (Edit Bus Number ONLY for Gate-In)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newBusNumber, setNewBusNumber] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [errorBanner, setErrorBanner] = useState('');

  const reasonSuggestions = [
    { value: 'Diesel Fill', label: '⛽ Diesel Fill / Fuel Station' },
    { value: 'Mechanic Shop / Repair', label: '🔧 Mechanic Shop / Breakdown Repair' },
    { value: 'General Service / Maintenance', label: '🛠️ General Service & Maintenance' },
    { value: 'Hostel Trip / Student Transport', label: '🏫 Hostel Trip / Campus Pick-up' },
    { value: 'Special Event / Off-Campus Duty', label: '🚌 Special Event / Off-Campus Duty' },
    { value: 'Custom', label: '✏️ Other / Custom Reason (Type below)' }
  ];

  const matchingBuses = buses.filter((b) => {
    if (!busSearchInput.trim()) return true;
    const query = busSearchInput.toLowerCase().trim();
    return (
      String(b.busNumber).includes(query) ||
      (b.registrationNumber && b.registrationNumber.toLowerCase().includes(query)) ||
      (b.routeName && b.routeName.toLowerCase().includes(query)) ||
      (b.assignedDriverName && b.assignedDriverName.toLowerCase().includes(query))
    );
  });

  const selectedBusObj = buses.find((b) => String(b.busNumber) === String(selectedBusNumber));

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [gate, busList, todayLogs, todayOutingLogs] = await Promise.all([
        securityService.getGateInfo(),
        securityService.getBuses(),
        securityService.getTodayEntries(),
        securityService.getTodayOutings()
      ]);
      setGateInfo(gate);
      setBuses(busList || []);
      setEntries(todayLogs || []);
      setOutings(todayOutingLogs || []);
      if (busList?.length > 0) {
        setSelectedBusNumber(String(busList[0].busNumber));
      }
    } catch (err) {
      setToast({ open: true, message: 'Failed to load security gate terminal', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(async () => {
      try {
        const [todayLogs, todayOutingLogs] = await Promise.all([
          securityService.getTodayEntries(),
          securityService.getTodayOutings()
        ]);
        setEntries(todayLogs || []);
        setOutings(todayOutingLogs || []);
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // 1-Click "BUS ENTER" button (Gate-In)
  const handleBusEnter = async (overrideBusNum) => {
    setErrorBanner('');
    const targetVal = overrideBusNum !== undefined ? overrideBusNum : selectedBusNumber;
    const num = parseInt(targetVal, 10);
    if (isNaN(num) || num < 0 || num > 150) {
      setErrorBanner('Please select a valid Bus Number between 0 and 150');
      return;
    }

    setActionLoading(true);
    try {
      await securityService.recordBusEntry(num);
      setToast({
        open: true,
        message: `✅ Bus #${num} GATE-IN ENTRY LOGGED at ${gateInfo?.gateName} (${new Date().toLocaleTimeString()})`,
        severity: 'success'
      });
      setBusSearchInput('');
      const updated = await securityService.getTodayEntries();
      setEntries(updated || []);
    } catch (err) {
      const msg = err.response?.data?.message || t('security.duplicateError');
      setErrorBanner(msg);
      setToast({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Record GATE-OUT Exit button
  const handleBusOuting = async () => {
    setErrorBanner('');
    const num = parseInt(selectedBusNumber, 10);
    if (isNaN(num) || num < 0 || num > 150) {
      setErrorBanner('Please select a valid Bus Number between 0 and 150');
      return;
    }

    let finalReason = reasonCategory === 'Custom' ? customReason.trim() : reasonCategory;
    if (reasonCategory !== 'Custom' && customReason.trim()) {
      finalReason = `${reasonCategory} (${customReason.trim()})`;
    }

    if (!finalReason) {
      setErrorBanner('Please enter or select a valid reason for bus gate exit');
      return;
    }

    setActionLoading(true);
    try {
      await securityService.recordBusOuting(num, finalReason);
      setToast({
        open: true,
        message: `📤 Bus #${num} GATE-OUT LOGGED [${finalReason}] at ${gateInfo?.gateName}`,
        severity: 'success'
      });
      setBusSearchInput('');
      setCustomReason('');
      const updatedOutings = await securityService.getTodayOutings();
      setOutings(updatedOutings || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to record bus gate-out exit';
      setErrorBanner(msg);
      setToast({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Modal (Can edit Bus Number ONLY)
  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setNewBusNumber(String(entry.busNumber));
    setEditError('');
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditError('');

    const num = parseInt(newBusNumber, 10);
    if (isNaN(num) || num < 0 || num > 150) {
      setEditError('Bus Number must be between 0 and 150');
      return;
    }

    setEditLoading(true);
    try {
      await securityService.updateBusEntryNumber(editingEntry.id, num);
      setToast({ open: true, message: `Updated entry to Bus #${num}`, severity: 'success' });
      setEditModalOpen(false);
      const updated = await securityService.getTodayEntries();
      setEntries(updated || []);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update bus number');
    } finally {
      setEditLoading(false);
    }
  };

  const filteredEntries = entries.filter((en) =>
    String(en.busNumber).includes(searchTerm) ||
    (en.registrationNumber && en.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (en.routeName && en.routeName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredOutings = outings.filter((ou) =>
    String(ou.busNumber).includes(searchTerm) ||
    (ou.exitReason && ou.exitReason.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (ou.registrationNumber && ou.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Banner */}
      <Card
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          p: { xs: 2.5, sm: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: 3.5,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <DoorOpen size={30} />
            </Box>

            <Box>
              <Typography variant="overline" sx={{ color: '#fbbf24', fontWeight: 800, letterSpacing: '0.1em' }}>
                {t('security.assignedGate').toUpperCase()}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                {gateInfo?.gateName || 'Main Gate'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                {t('security.gateOnlyNote')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Clock size={18} color="#60a5fa" />
            <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700 }}>
              Live Gate Movement Terminal
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Movement Mode Toggle Tabs (GATE-IN vs GATE-OUT) */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Tabs
          value={movementMode}
          onChange={(e, val) => setMovementMode(val)}
          textColor="inherit"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: movementMode === 'GATE_IN' ? '#10b981' : '#f59e0b',
              height: 4,
              borderRadius: '4px 4px 0 0'
            }
          }}
        >
          <Tab
            value="GATE_IN"
            label="📥 GATE-IN (BUS ENTER / ARRIVAL)"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '0.85rem', sm: '1rem' },
              color: movementMode === 'GATE_IN' ? '#34d399' : '#94a3b8',
              px: { xs: 2, sm: 3 },
              py: 1.5
            }}
          />
          <Tab
            value="GATE_OUT"
            label="📤 GATE-OUT (BUS EXIT WITH REASON)"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '0.85rem', sm: '1rem' },
              color: movementMode === 'GATE_OUT' ? '#fbbf24' : '#94a3b8',
              px: { xs: 2, sm: 3 },
              py: 1.5
            }}
          />
        </Tabs>
      </Box>

      {errorBanner && (
        <Alert severity="error" icon={<AlertTriangle size={22} />} sx={{ borderRadius: 3, fontSize: '0.95rem' }}>
          {errorBanner}
        </Alert>
      )}

      {/* Main Bus Action Card */}
      <Card
        sx={{
          borderRadius: 4,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: movementMode === 'GATE_IN' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
          p: { xs: 2.5, sm: 3.5 }
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {movementMode === 'GATE_IN' ? '📥 Record Bus Campus Arrival' : '📤 Record Bus Gate-Out / Campus Exit'}
            </Typography>
            <Chip
              label={movementMode === 'GATE_IN' ? "1-Click Campus Entry Log" : "Select / Type Outing Reason"}
              size="small"
              color={movementMode === 'GATE_IN' ? "success" : "warning"}
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Box>

          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2.5 }}>
            {movementMode === 'GATE_IN'
              ? 'Select bus number and click BUS ENTER to record campus arrival.'
              : 'Select bus number, pick outing reason from scrollable suggestions (or type reason), and click RECORD GATE-OUT.'}
          </Typography>

          {/* Search Box & Action Bar */}
          <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={movementMode === 'GATE_OUT' ? 6 : 7} md={movementMode === 'GATE_OUT' ? 4 : 8}>
              <TextField
                fullWidth
                size="medium"
                placeholder="🔍 Type Bus Number (e.g. 25, 42, 7) or Route Name..."
                value={busSearchInput}
                onChange={(e) => {
                  setBusSearchInput(e.target.value);
                  const exact = buses.find((b) => String(b.busNumber) === e.target.value.trim());
                  if (exact) {
                    setSelectedBusNumber(String(exact.busNumber));
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color={movementMode === 'GATE_IN' ? "#34d399" : "#fbbf24"} />
                    </InputAdornment>
                  ),
                  endAdornment: busSearchInput && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setBusSearchInput('')} sx={{ color: '#94a3b8' }}>
                        ✕
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    fontSize: '1.05rem',
                    fontWeight: 600
                  }
                }}
              />
            </Grid>

            {/* GATE-OUT Reason Dropdown & Custom Type Input */}
            {movementMode === 'GATE_OUT' && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  select
                  size="medium"
                  label="Select Outing Reason (Scroll Down)"
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      fontWeight: 700
                    }
                  }}
                >
                  {reasonSuggestions.map((item) => (
                    <MenuItem key={item.value} value={item.value} sx={{ fontWeight: 600, py: 1 }}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Optional details / custom reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  sx={{ mt: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                />
              </Grid>
            )}

            {/* Giant Action Button */}
            <Grid item xs={12} sm={12} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {movementMode === 'GATE_IN' ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => handleBusEnter()}
                    disabled={actionLoading || !selectedBusNumber}
                    startIcon={actionLoading ? <CircularProgress size={24} color="inherit" /> : <Bus size={26} />}
                    sx={{
                      py: 1.5,
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      letterSpacing: '0.05em',
                      borderRadius: 3.5,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                      color: '#ffffff'
                    }}
                  >
                    {actionLoading ? t('security.recording') : `${t('security.enterBusBtn')} #${selectedBusNumber || '?'}`}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    size="large"
                    onClick={() => handleBusOuting()}
                    disabled={actionLoading || !selectedBusNumber}
                    startIcon={actionLoading ? <CircularProgress size={24} color="inherit" /> : <LogOut size={26} />}
                    sx={{
                      py: 1.5,
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      letterSpacing: '0.05em',
                      borderRadius: 3.5,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
                      color: '#ffffff'
                    }}
                  >
                    {actionLoading ? "Logging Exit..." : `RECORD GATE-OUT #${selectedBusNumber || '?'}`}
                  </Button>
                )}
              </motion.div>
            </Grid>
          </Grid>

          {/* Selected Bus Banner Info */}
          {selectedBusObj && (
            <Box
              sx={{
                p: 2,
                mb: 2.5,
                borderRadius: 3,
                backgroundColor: movementMode === 'GATE_IN' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                border: movementMode === 'GATE_IN' ? '2px solid #10b981' : '2px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    px: 1.8,
                    py: 0.8,
                    borderRadius: 2.5,
                    backgroundColor: movementMode === 'GATE_IN' ? '#10b981' : '#f59e0b',
                    color: '#0f172a',
                    fontWeight: 900,
                    fontSize: '1.25rem'
                  }}
                >
                  Bus #{selectedBusObj.busNumber}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                    {selectedBusObj.registrationNumber} • {selectedBusObj.routeName || 'Campus Shuttle'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                    Driver: <strong>{selectedBusObj.assignedDriverName || 'Unassigned'}</strong> {selectedBusObj.assignedDriverMobile ? `(📱 ${selectedBusObj.assignedDriverMobile})` : ''}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={movementMode === 'GATE_IN' ? "Selected & Ready for Gate Entry" : "Selected & Ready for Gate Exit"}
                color={movementMode === 'GATE_IN' ? "success" : "warning"}
                size="small"
                sx={{ fontWeight: 800, borderRadius: 2 }}
              />
            </Box>
          )}

          {/* Scrollable Bus Touch Grid */}
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 1 }}>
            QUICK SELECT BUS (TOUCH / CLICK):
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 1.5,
              maxHeight: 220,
              overflowY: 'auto',
              pr: 1
            }}
          >
            {matchingBuses.map((b) => {
              const isSelected = String(b.busNumber) === String(selectedBusNumber);
              return (
                <motion.div key={b.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Box
                    onClick={() => setSelectedBusNumber(String(b.busNumber))}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      cursor: 'pointer',
                      textAlign: 'center',
                      backgroundColor: isSelected
                        ? (movementMode === 'GATE_IN' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)')
                        : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected
                        ? (movementMode === 'GATE_IN' ? '2px solid #10b981' : '2px solid #f59e0b')
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        color: isSelected ? (movementMode === 'GATE_IN' ? '#34d399' : '#fbbf24') : '#f8fafc',
                        fontSize: '1.15rem'
                      }}
                    >
                      Bus #{b.busNumber}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 700, display: 'block' }}>
                      {b.routeName || 'Campus'}
                    </Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Movement Log Tables */}
      {movementMode === 'GATE_IN' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              📥 {t('security.todayEntries')} ({filteredEntries.length})
            </Typography>

            <TextField
              size="small"
              placeholder={t('security.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#94a3b8" />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bus Number</TableCell>
                  <TableCell>Registration Plate</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Gate Name</TableCell>
                  <TableCell>Entry Date</TableCell>
                  <TableCell>Entry Time</TableCell>
                  <TableCell align="right">Edit (Bus No Only)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                      No bus entries recorded at gate today yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>
                        <Chip
                          label={`Bus #${entry.busNumber}`}
                          color="success"
                          sx={{ fontWeight: 800, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>
                        {entry.registrationNumber}
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>
                        {entry.routeName || '-'}
                      </TableCell>
                      <TableCell sx={{ color: '#fbbf24', fontWeight: 700 }}>
                        {entry.gateName}
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>
                        {entry.entryDate}
                      </TableCell>
                      <TableCell sx={{ color: '#60a5fa', fontWeight: 800, fontSize: '0.95rem' }}>
                        {entry.entryTime ? String(entry.entryTime).substring(0, 8) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          color="info"
                          startIcon={<Edit size={14} />}
                          onClick={() => handleOpenEdit(entry)}
                          sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                          Edit Bus #
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        /* GATE-OUT Table */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              📤 Today's Gate-Out Movements ({filteredOutings.length})
            </Typography>

            <TextField
              size="small"
              placeholder="Search outings by Bus # or Reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#94a3b8" />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bus Number</TableCell>
                  <TableCell>Registration Plate</TableCell>
                  <TableCell>Route Name</TableCell>
                  <TableCell>Gate Name</TableCell>
                  <TableCell>Exit Reason</TableCell>
                  <TableCell>Exit Date</TableCell>
                  <TableCell>Exit Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOutings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                      No bus gate-out exits recorded today yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOutings.map((outing) => (
                    <TableRow key={outing.id} hover>
                      <TableCell>
                        <Chip
                          label={`Bus #${outing.busNumber}`}
                          color="warning"
                          sx={{ fontWeight: 800, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>
                        {outing.registrationNumber}
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>
                        {outing.routeName || '-'}
                      </TableCell>
                      <TableCell sx={{ color: '#fbbf24', fontWeight: 700 }}>
                        {outing.gateName}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={outing.exitReason}
                          variant="outlined"
                          color="warning"
                          sx={{ fontWeight: 800, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>
                        {outing.outingDate}
                      </TableCell>
                      <TableCell sx={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.95rem' }}>
                        {outing.exitTime ? String(outing.exitTime).substring(0, 8) : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Edit Bus Number Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#f8fafc' }}>
          {t('security.editModalTitle')}
        </DialogTitle>
        <Box component="form" onSubmit={handleSaveEdit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 600 }}>
              {t('security.editNotice')}
            </Typography>

            {editError && (
              <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
                {editError}
              </Typography>
            )}

            <Box sx={{ p: 1.5, borderRadius: 2.5, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                Gate: {editingEntry?.gateName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                Entry Timestamp: {editingEntry?.entryDate} • {editingEntry?.entryTime} (Locked)
              </Typography>
            </Box>

            <TextField
              fullWidth
              select
              label={t('security.newBusNumber')}
              value={newBusNumber}
              onChange={(e) => setNewBusNumber(e.target.value)}
              required
            >
              {buses.map((b) => (
                <MenuItem key={b.id} value={String(b.busNumber)}>
                  Bus #{b.busNumber} ({b.registrationNumber})
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditModalOpen(false)} sx={{ color: '#cbd5e1' }}>
              {t('security.cancel')}
            </Button>
            <Button type="submit" variant="contained" color="warning" disabled={editLoading}>
              {editLoading ? <CircularProgress size={16} color="inherit" /> : t('security.saveChanges')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <NotificationToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};
