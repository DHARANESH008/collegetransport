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
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { MapPin, Plus, Edit, Trash2, Search, Navigation } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { NotificationToast } from '../../components/NotificationToast';

export const RouteMasterPage = () => {
  const { t } = useLanguage();

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('College Campus');
  const [stops, setStops] = useState('');
  const [approxDistanceKm, setApproxDistanceKm] = useState('30.0');
  const [formError, setFormError] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getRoutes();
      setRoutes(data || []);
    } catch (err) {
      setToast({ open: true, message: 'Failed to load routes', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (route = null) => {
    setFormError('');
    if (route) {
      setEditingRoute(route);
      setRouteName(route.routeName);
      setStartPoint(route.startPoint);
      setEndPoint(route.endPoint);
      setStops(route.stops || '');
      setApproxDistanceKm(String(route.approxDistanceKm || 0));
    } else {
      setEditingRoute(null);
      setRouteName('');
      setStartPoint('');
      setEndPoint('College Campus');
      setStops('');
      setApproxDistanceKm('30.0');
    }
    setDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      routeName: routeName.trim(),
      startPoint: startPoint.trim(),
      endPoint: endPoint.trim(),
      stops: stops.trim(),
      approxDistanceKm: parseFloat(approxDistanceKm) || 0.0
    };

    try {
      if (editingRoute) {
        await adminService.updateRoute(editingRoute.id, payload);
        setToast({ open: true, message: `Route "${routeName}" updated`, severity: 'success' });
      } else {
        await adminService.createRoute(payload);
        setToast({ open: true, message: `Route "${routeName}" created`, severity: 'success' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save route');
    }
  };

  const handleDelete = async () => {
    if (!routeToDelete) return;
    try {
      await adminService.deleteRoute(routeToDelete.id);
      setToast({ open: true, message: `Route "${routeToDelete.routeName}" deleted`, severity: 'success' });
      setDeleteConfirmOpen(false);
      setRouteToDelete(null);
      fetchData();
    } catch (err) {
      setToast({ open: true, message: 'Failed to delete route', severity: 'error' });
    }
  };

  const filtered = routes.filter((r) =>
    r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.stops && r.stops.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: '#fff'
            }}
          >
            <MapPin size={22} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {t('masters.routeTitle')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              College Bus Routes (Erode, Tiruppur, Gobi, Bhavani, etc.)
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 3, fontWeight: 700, background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
        >
          {t('masters.addRoute')}
        </Button>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: 2, borderRadius: 3.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Route Name, Origin, or Major Stops..."
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

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Route Name</TableCell>
                <TableCell>Origin & Destination</TableCell>
                <TableCell>Major Boarding Stops</TableCell>
                <TableCell>Approx Distance</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    No routes found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((route) => (
                  <TableRow key={route.id} hover>
                    <TableCell sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>
                      {route.routeName}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Navigation size={14} color="#8b5cf6" />
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          {route.startPoint} ➔ {route.endPoint}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {route.stops || '-'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#60a5fa' }}>
                      {route.approxDistanceKm} KM
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(route)} sx={{ color: '#60a5fa', mr: 1 }}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setRouteToDelete(route);
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
          {editingRoute ? t('masters.editRoute') : t('masters.addRoute')}
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
              label="Route Name (e.g. Erode, Tiruppur, Perundurai)"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Start Point (Origin)"
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="End Point (Destination)"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Major Boarding Stops (Comma separated)"
              multiline
              rows={2}
              value={stops}
              onChange={(e) => setStops(e.target.value)}
            />

            <TextField
              fullWidth
              type="number"
              step="0.1"
              label="Approximate Distance (KM)"
              value={approxDistanceKm}
              onChange={(e) => setApproxDistanceKm(e.target.value)}
              required
            />
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

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Route Record"
        message={`Are you sure you want to delete route "${routeToDelete?.routeName}"?`}
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
