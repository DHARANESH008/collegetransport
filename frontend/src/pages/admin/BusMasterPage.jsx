import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Bus, Plus, Edit, Trash2, Search, MapPin, DoorOpen, Users } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { NotificationToast } from '../../components/NotificationToast';

export const BusMasterPage = () => {
  const { t } = useLanguage();

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formBusNumber, setFormBusNumber] = useState('');
  const [formRegNo, setFormRegNo] = useState('');
  const [formCapacity, setFormCapacity] = useState('55');
  const [formRouteId, setFormRouteId] = useState('');
  const [formGateId, setFormGateId] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');
  const [formError, setFormError] = useState('');

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);

  // Toast
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [busList, routeList, gateList] = await Promise.all([
        adminService.getBuses(),
        adminService.getRoutes(),
        adminService.getGates()
      ]);
      setBuses(busList || []);
      setRoutes(routeList || []);
      setGates(gateList || []);
    } catch (err) {
      setToast({ open: true, message: 'Failed to load master records', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (bus = null) => {
    setFormError('');
    if (bus) {
      setEditingBus(bus);
      setFormBusNumber(String(bus.busNumber));
      setFormRegNo(bus.registrationNumber);
      setFormCapacity(String(bus.capacity || 55));
      setFormRouteId(bus.routeId ? String(bus.routeId) : '');
      setFormGateId(bus.assignedGateId ? String(bus.assignedGateId) : '');
      setFormStatus(bus.status || 'ACTIVE');
    } else {
      setEditingBus(null);
      setFormBusNumber('');
      setFormRegNo('');
      setFormCapacity('55');
      setFormRouteId(routes.length > 0 ? String(routes[0].id) : '');
      setFormGateId(gates.length > 0 ? String(gates[0].id) : '');
      setFormStatus('ACTIVE');
    }
    setDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    const num = parseInt(formBusNumber, 10);
    if (isNaN(num) || num < 0 || num > 150) {
      setFormError('Bus Number must be strictly between 0 and 150');
      return;
    }
    if (!formRegNo.trim()) {
      setFormError('Registration plate number is required');
      return;
    }

    const payload = {
      busNumber: num,
      registrationNumber: formRegNo.trim().toUpperCase(),
      capacity: parseInt(formCapacity, 10) || 55,
      routeId: formRouteId ? parseInt(formRouteId, 10) : null,
      assignedGateId: formGateId ? parseInt(formGateId, 10) : null,
      status: formStatus
    };

    try {
      if (editingBus) {
        await adminService.updateBus(editingBus.id, payload);
        setToast({ open: true, message: `Bus #${num} updated successfully`, severity: 'success' });
      } else {
        await adminService.createBus(payload);
        setToast({ open: true, message: `Bus #${num} created successfully`, severity: 'success' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save bus');
    }
  };

  const handleDelete = async () => {
    if (!busToDelete) return;
    try {
      await adminService.deleteBus(busToDelete.id);
      setToast({ open: true, message: `Bus #${busToDelete.busNumber} deleted`, severity: 'success' });
      setDeleteConfirmOpen(false);
      setBusToDelete(null);
      fetchData();
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || 'Failed to delete bus', severity: 'error' });
    }
  };

  const filteredBuses = buses.filter((b) =>
    String(b.busNumber).includes(searchTerm) ||
    (b.registrationNumber && b.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.routeName && b.routeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.assignedDriverName && b.assignedDriverName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: '#fff'
              }}
            >
              <Bus size={22} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                {t('masters.busTitle')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Fleet Management for Bus Numbers 0 to 150
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {t('masters.addBus')}
        </Button>
      </Box>

      {/* Filter & Search Bar */}
      <Card sx={{ p: 2, borderRadius: 3.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Bus #, Plate Number, Route, or Driver Name..."
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

      {/* Bus List Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bus No (0–150)</TableCell>
                <TableCell>Registration Plate</TableCell>
                <TableCell>Assigned Route</TableCell>
                <TableCell>Assigned Gate</TableCell>
                <TableCell>Assigned Driver</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    No buses found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBuses.map((bus) => (
                  <TableRow key={bus.id} hover>
                    <TableCell>
                      <Chip
                        label={`Bus #${bus.busNumber}`}
                        color="primary"
                        sx={{ fontWeight: 800, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#f8fafc' }}>
                      {bus.registrationNumber}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <MapPin size={15} color="#60a5fa" />
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          {bus.routeName || <span style={{ color: '#64748b' }}>Unassigned</span>}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <DoorOpen size={15} color="#fbbf24" />
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          {bus.assignedGateName || <span style={{ color: '#64748b' }}>Unassigned</span>}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Users size={15} color="#34d399" />
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          {bus.assignedDriverName ? (
                            <>
                              {bus.assignedDriverName}
                              {bus.assignedDriverMobile && (
                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                  📱 {bus.assignedDriverMobile}
                                </Typography>
                              )}
                            </>
                          ) : (
                            <span style={{ color: '#64748b' }}>No Driver Assigned</span>
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={bus.status}
                        size="small"
                        color={bus.status === 'ACTIVE' ? 'success' : 'default'}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(bus)}
                        sx={{ color: '#60a5fa', mr: 1 }}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setBusToDelete(bus);
                          setDeleteConfirmOpen(true);
                        }}
                        sx={{ color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Add/Edit Modal */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
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
          {editingBus ? t('masters.editBus') : t('masters.addBus')}
        </DialogTitle>
        <Box component="form" onSubmit={handleSave}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formError && (
              <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
                {formError}
              </Typography>
            )}

            <TextField
              fullWidth
              type="number"
              label="Bus Number (0–150)"
              value={formBusNumber}
              onChange={(e) => setFormBusNumber(e.target.value)}
              inputProps={{ min: 0, max: 150 }}
              required
            />

            <TextField
              fullWidth
              label="Registration Plate (e.g. TN 33 BM 1025)"
              value={formRegNo}
              onChange={(e) => setFormRegNo(e.target.value)}
              required
            />

            <TextField
              fullWidth
              type="number"
              label="Capacity (Seats)"
              value={formCapacity}
              onChange={(e) => setFormCapacity(e.target.value)}
            />

            <TextField
              fullWidth
              select
              label="Assigned Route"
              value={formRouteId}
              onChange={(e) => setFormRouteId(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {routes.map((r) => (
                <MenuItem key={r.id} value={String(r.id)}>
                  {r.routeName} ({r.approxDistanceKm} KM)
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Assigned Gate"
              value={formGateId}
              onChange={(e) => setFormGateId(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {gates.map((g) => (
                <MenuItem key={g.id} value={String(g.id)}>
                  {g.gateName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ color: '#cbd5e1' }}>
              {t('security.cancel')}
            </Button>
            <Button type="submit" variant="contained">
              {t('masters.save')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Bus Record"
        message={`Are you sure you want to delete Bus #${busToDelete?.busNumber} (${busToDelete?.registrationNumber})?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
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
