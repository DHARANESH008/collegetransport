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
import { DoorOpen, Plus, Edit, Trash2, Search } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { NotificationToast } from '../../components/NotificationToast';

export const GateMasterPage = () => {
  const { t } = useLanguage();

  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGate, setEditingGate] = useState(null);
  const [gateName, setGateName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [gateToDelete, setGateToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getGates();
      setGates(data || []);
    } catch (err) {
      setToast({ open: true, message: 'Failed to load gates', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (gate = null) => {
    setFormError('');
    if (gate) {
      setEditingGate(gate);
      setGateName(gate.gateName);
      setDescription(gate.description || '');
    } else {
      setEditingGate(null);
      setGateName('');
      setDescription('');
    }
    setDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      gateName: gateName.trim(),
      description: description.trim()
    };

    try {
      if (editingGate) {
        await adminService.updateGate(editingGate.id, payload);
        setToast({ open: true, message: `Gate "${gateName}" updated`, severity: 'success' });
      } else {
        await adminService.createGate(payload);
        setToast({ open: true, message: `Gate "${gateName}" created`, severity: 'success' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save gate');
    }
  };

  const handleDelete = async () => {
    if (!gateToDelete) return;
    try {
      await adminService.deleteGate(gateToDelete.id);
      setToast({ open: true, message: `Gate "${gateToDelete.gateName}" deleted`, severity: 'success' });
      setDeleteConfirmOpen(false);
      setGateToDelete(null);
      fetchData();
    } catch (err) {
      setToast({ open: true, message: 'Failed to delete gate', severity: 'error' });
    }
  };

  const filtered = gates.filter((g) =>
    g.gateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              color: '#fff'
            }}
          >
            <DoorOpen size={22} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {t('masters.gateTitle')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Campus Entrance Checkpoints (Main Gate, South Gate, etc.)
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 3, fontWeight: 700, background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}
        >
          {t('masters.addGate')}
        </Button>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: 2, borderRadius: 3.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Gate Name or Description..."
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
                <TableCell>Gate Name</TableCell>
                <TableCell>Location / Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    No gates found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((gate) => (
                  <TableRow key={gate.id} hover>
                    <TableCell sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>
                      {gate.gateName}
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }}>
                      {gate.description || '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(gate)} sx={{ color: '#60a5fa', mr: 1 }}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setGateToDelete(gate);
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
          {editingGate ? t('masters.editGate') : t('masters.addGate')}
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
              label="Gate Name (e.g. Main Gate, South Gate)"
              value={gateName}
              onChange={(e) => setGateName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Description / Location Notes"
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
        title="Delete Gate Record"
        message={`Are you sure you want to delete gate "${gateToDelete?.gateName}"?`}
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
