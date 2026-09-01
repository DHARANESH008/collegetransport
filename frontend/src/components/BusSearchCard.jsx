import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Search, Bus, Phone, MapPin, DoorOpen, Clock, Gauge, Users, CheckCircle, Navigation } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export const BusSearchCard = () => {
  const { t } = useLanguage();
  const [busNumberInput, setBusNumberInput] = useState('25');
  const [busData, setBusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const num = parseInt(busNumberInput, 10);
    if (isNaN(num) || num < 0 || num > 150) {
      setError('Please enter a valid Bus Number between 0 and 150');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await adminService.searchBus(num);
      setBusData(data);
    } catch (err) {
      setError(err.response?.data?.message || t('busSearch.notFound'));
      setBusData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_TRANSIT': return 'info';
      case 'COLLEGE_ARRIVED': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: 4,
        boxShadow: '0 10px 35px rgba(0,0,0,0.4)',
        p: { xs: 1, sm: 2 }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#fff'
            }}
          >
            <Search size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {t('busSearch.title')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              {t('busSearch.subtitle')}
            </Typography>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
          <TextField
            fullWidth
            type="number"
            placeholder={t('busSearch.enterBusNo')}
            value={busNumberInput}
            onChange={(e) => setBusNumberInput(e.target.value)}
            inputProps={{ min: 0, max: 150 }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                borderRadius: 3
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Search size={18} />}
            sx={{ px: 3, borderRadius: 3, minWidth: 140 }}
          >
            {t('busSearch.searchBtn')}
          </Button>
        </Box>

        {/* Quick select buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            {t('busSearch.quickSelect')}
          </Typography>
          {[25, 42, 18, 7, 55, 88, 105, 0, 150].map((num) => (
            <Chip
              key={num}
              label={`#${num}`}
              size="small"
              onClick={() => {
                setBusNumberInput(String(num));
                adminService.searchBus(num).then(setBusData).catch(() => setBusData(null));
              }}
              clickable
              sx={{
                borderRadius: 2,
                backgroundColor: busNumberInput === String(num) ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                borderColor: busNumberInput === String(num) ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                borderStyle: 'solid',
                color: '#f8fafc',
                fontWeight: 700
              }}
            />
          ))}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Live Search Result Inspector Card */}
        <AnimatePresence mode="wait">
          {busData && (
            <motion.div
              key={busData.busNumber}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3.5,
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }}
              >
                {/* Top Bus Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: 3,
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid #3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#60a5fa'
                      }}
                    >
                      <Bus size={28} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                        Bus #{busData.busNumber}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#60a5fa', fontWeight: 700 }}>
                        {busData.registrationNumber} • {busData.capacity} Seats
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={busData.journeyStatus || 'NOT_STARTED'}
                    color={getStatusColor(busData.journeyStatus)}
                    sx={{ fontWeight: 800, borderRadius: 2, px: 1, py: 0.5 }}
                  />
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

                {/* Telemetry Grid */}
                <Grid container spacing={2.5}>
                  {/* Route */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <MapPin size={18} color="#60a5fa" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                          {t('busSearch.route')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                          {busData.route}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Driver Name & Call */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Users size={18} color="#34d399" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                          {t('busSearch.driverName')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                            {busData.driverName}
                          </Typography>
                          {busData.driverMobile && busData.driverMobile !== 'N/A' && (
                            <Tooltip title={`${t('busSearch.callDriver')}: ${busData.driverMobile}`}>
                              <IconButton
                                size="small"
                                href={`tel:${busData.driverMobile}`}
                                sx={{ p: 0.3, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
                              >
                                <Phone size={14} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Assigned Gate */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <DoorOpen size={18} color="#fbbf24" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                          {t('busSearch.gate')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                          {busData.assignedGate}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Security Gate Entry Time */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Clock size={18} color="#f472b6" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                          {t('busSearch.gateEntryTime')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                          {busData.securityGateEntryTime || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Journey Start Time */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Navigation size={18} color="#38bdf8" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                          {t('busSearch.journeyStartTime')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                          {busData.journeyStartTime || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Journey End Time */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <CheckCircle size={18} color="#a78bfa" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                          {t('busSearch.journeyEndTime')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                          {busData.journeyEndTime || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Odometer Readings: Start KM & End KM */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Gauge size={18} color="#fb923c" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                          {t('busSearch.startKm')} / {t('busSearch.endKm')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                          {busData.startKm ?? '-'} KM / {busData.endKm ?? '-'} KM
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Total Distance & Students */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Users size={18} color="#2dd4bf" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                          {t('busSearch.totalDistance')} / {t('busSearch.studentCount')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#34d399', fontWeight: 800 }}>
                          {busData.totalDistance != null ? `${busData.totalDistance} KM` : '-'} • {busData.studentCount ?? 0} Students
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
