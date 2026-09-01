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
  Alert
} from '@mui/material';
import { ShieldAlert, DoorOpen, Plus, Edit, Search, Clock, CheckCircle2, AlertTriangle, Bus } from 'lucide-react';
import { securityService } from '../../services/securityService';
import { adminService } from '../../services/adminService';
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
  const [loading, setLoading] = useState(true);
  const [entering, setEntering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal State (Edit Bus Number ONLY)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newBusNumber, setNewBusNumber] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [errorBanner, setErrorBanner] = useState('');

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
      const [gate, busList, todayLogs] = await Promise.all([
        securityService.getGateInfo(),
        securityService.getBuses(),
        securityService.getTodayEntries()
      ]);
      setGateInfo(gate);
      setBuses(busList || []);
      setEntries(todayLogs || []);
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
        const todayLogs = await securityService.getTodayEntries();
        setEntries(todayLogs || []);
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // 1-Click "BUS ENTER" button
  const handleBusEnter = async (overrideBusNum) => {
    setErrorBanner('');

    const targetVal = overrideBusNum !== undefined ? overrideBusNum : selectedBusNumber;
    const num = parseInt(targetVal, 10);
    if (isNaN(num) || num < 0 || num > 150) {
      setErrorBanner('Please select a valid Bus Number between 0 and 150');
      return;
    }

    setEntering(true);
    try {
      const res = await securityService.recordBusEntry(num);
      setToast({
        open: true,
        message: `✅ Bus #${num} ENTRY LOGGED at ${gateInfo?.gateName} (${new Date().toLocaleTimeString()})`,
        severity: 'success'
      });

      // Clear search box for next bus
      setBusSearchInput('');

      // Refresh today's logs
      const updated = await securityService.getTodayEntries();
      setEntries(updated || []);
    } catch (err) {
      const msg = err.response?.data?.message || t('security.duplicateError');
      setErrorBanner(msg);
      setToast({ open: true, message: msg, severity: 'error' });
    } finally {
      setEntering(false);
    }
  };

  // Open Edit Modal (Can edit Bus Number ONLY; Date/Time immutable)
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Banner: ONLY Gate Name is shown; Security staff name is hidden */}
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
              Live Entry Gate Terminal
            </Typography>
          </Box>
        </Box>
      </Card>

      {errorBanner && (
        <Alert severity="error" icon={<AlertTriangle size={22} />} sx={{ borderRadius: 3, fontSize: '0.95rem' }}>
          {errorBanner}
        </Alert>
      )}

      {/* Main Bus Entry Action Card with Live Search & Scrollable Grid */}
      <Card
        sx={{
          borderRadius: 4,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
          p: { xs: 2.5, sm: 3.5 }
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              🚍 {t('security.selectBus')} (0–150)
            </Typography>
            <Chip
              label="Type Bus # OR Scroll & Touch to Select"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Box>

          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2.5 }}>
            Type in the search box below or scroll through the bus list, touch the bus, and press <strong>BUS ENTER</strong>.
          </Typography>

          {/* Search Box & Enter Action Bar */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={7} md={8}>
              <TextField
                fullWidth
                size="medium"
                placeholder="🔍 Type Bus Number (e.g. 25, 42, 7) or Route Name (Erode, Tiruppur)..."
                value={busSearchInput}
                onChange={(e) => {
                  setBusSearchInput(e.target.value);
                  const exact = buses.find((b) => String(b.busNumber) === e.target.value.trim());
                  if (exact) {
                    setSelectedBusNumber(String(exact.busNumber));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedBusNumber) {
                      handleBusEnter();
                    } else if (matchingBuses.length > 0) {
                      setSelectedBusNumber(String(matchingBuses[0].busNumber));
                      setTimeout(() => handleBusEnter(matchingBuses[0].busNumber), 50);
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="#fbbf24" />
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

            {/* Giant "BUS ENTER" Button */}
            <Grid item xs={12} sm={5} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  size="large"
                  onClick={() => handleBusEnter()}
                  disabled={entering || !selectedBusNumber}
                  startIcon={entering ? <CircularProgress size={24} color="inherit" /> : <Bus size={26} />}
                  sx={{
                    py: 1.5,
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                    borderRadius: 3.5,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
                    color: '#ffffff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      boxShadow: '0 15px 35px rgba(245, 158, 11, 0.6)'
                    }
                  }}
                >
                  {entering ? t('security.recording') : `${t('security.enterBusBtn')} #${selectedBusNumber || '?'}`}
                </Button>
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
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '2px solid #f59e0b',
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
                    backgroundColor: '#f59e0b',
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
                label="Selected & Ready for Gate Entry"
                color="success"
                size="small"
                sx={{ fontWeight: 800, borderRadius: 2 }}
              />
            </Box>
          )}

          {/* Touch-Friendly Scrollable Bus Grid / List */}
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1, display: 'block' }}>
            👇 Touch any Bus below to select ({matchingBuses.length} buses available):
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(130px, 1fr))',
                sm: 'repeat(auto-fill, minmax(150px, 1fr))',
                md: 'repeat(auto-fill, minmax(170px, 1fr))'
              },
              gap: 1.5,
              maxHeight: '260px',
              overflowY: 'auto',
              p: 1,
              borderRadius: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            {matchingBuses.length === 0 ? (
              <Box sx={{ gridColumn: '1 / -1', py: 4, textAlign: 'center', color: '#94a3b8' }}>
                No bus matching "{busSearchInput}". Try another bus number (0–150).
              </Box>
            ) : (
              matchingBuses.map((b) => {
                const isSelected = String(b.busNumber) === String(selectedBusNumber);
                return (
                  <motion.div key={b.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                    <Box
                      onClick={() => {
                        setSelectedBusNumber(String(b.busNumber));
                        setBusSearchInput(String(b.busNumber));
                      }}
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: isSelected ? '0 0 20px rgba(245, 158, 11, 0.4)' : 'none',
                        '&:hover': {
                          backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                          borderColor: '#fbbf24'
                        }
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 900,
                          color: isSelected ? '#fbbf24' : '#f8fafc',
                          fontSize: '1.2rem',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        Bus #{b.busNumber}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 700, display: 'block', mt: 0.2 }}>
                        {b.routeName || 'Campus'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem', display: 'block' }}>
                        {b.registrationNumber}
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Today's Entries Table with Search & Edit */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
            {t('security.todayEntries')} ({filteredEntries.length})
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
                        color="warning"
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

      {/* Edit Bus Number Modal (Date and Time are immutable) */}
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

            {/* Readonly Date/Time Indicators */}
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
