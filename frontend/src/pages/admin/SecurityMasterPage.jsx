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
import { ShieldCheck, Plus, Edit, Trash2, Search, Phone, Mail, DoorOpen } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { NotificationToast } from '../../components/NotificationToast';

export const SecurityMasterPage = () => {
  const { t } = useLanguage();

  const [staffList, setStaffList] = useState([]);
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [assignedGateId, setAssignedGateId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [formError, setFormError] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [data, gtList] = await Promise.all([
        adminService.getSecurityStaff(),
        adminService.getGates()
      ]);
      setStaffList(data || []);
      setGates(gtList || []);
    } catch (err) {
      setToast({ open: true, message: 'Failed to load security staff', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (staff = null) => {
    setFormError('');
    if (staff) {
      setEditingStaff(staff);
      setName(staff.name);
      setEmail(staff.email);
      setMobileNumber(staff.mobileNumber);
      setUsername(staff.username);
      setPassword('');
      setAssignedGateId(staff.assignedGateId ? String(staff.assignedGateId) : '');
      setStatus(staff.status || 'ACTIVE');
    } else {
      setEditingStaff(null);
      setName('');
      setEmail('');
      setMobileNumber('');
      setUsername('');
      setPassword('');
      setAssignedGateId('');
      setStatus('ACTIVE');
    }
    setDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      name: name.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim(),
      username: username.trim(),
      password: password ? password.trim() : undefined,
      assignedGateId: assignedGateId ? parseInt(assignedGateId, 10) : null,
      status
    };

    if (!editingStaff && (!password || password.length < 6)) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      if (editingStaff) {
        await adminService.updateSecurityStaff(editingStaff.id, payload);
        setToast({ open: true, message: `Security staff "${name}" updated`, severity: 'success' });
      } else {
        await adminService.createSecurityStaff(payload);
        setToast({ open: true, message: `Security staff "${name}" created`, severity: 'success' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save staff');
    }
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;
    try {
      await adminService.deleteSecurityStaff(staffToDelete.id);
      setToast({ open: true, message: `Security staff deleted`, severity: 'success' });
      setDeleteConfirmOpen(false);
      setStaffToDelete(null);
      fetchData();
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || 'Failed to delete staff', severity: 'error' });
    }
  };

  const filtered = staffList.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.mobileNumber.includes(searchTerm) ||
    s.username.toLowerCase().includes(searchTerm.toLowerCase())
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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff'
            }}
          >
            <ShieldCheck size={22} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {t('masters.securityTitle')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Gate Security Staff Accounts & Checkpoint Links
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="warning"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {t('masters.addSecurity')}
        </Button>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: 2, borderRadius: 3.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Security Name, Mobile, or Username..."
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
                <TableCell>Security Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Assigned Gate</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    No security staff found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((staff) => (
                  <TableRow key={staff.id} hover>
                    <TableCell sx={{ fontWeight: 800, color: '#f8fafc' }}>
                      {staff.name}
                    </TableCell>
                    <TableCell sx={{ color: '#fbbf24', fontWeight: 600 }}>
                      @{staff.username}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Phone size={14} color="#10b981" />
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          {staff.mobileNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Mail size={14} color="#94a3b8" />
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          {staff.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {staff.assignedGateName ? (
                        <Chip
                          icon={<DoorOpen size={14} />}
                          label={staff.assignedGateName}
                          size="small"
                          color="warning"
                          sx={{ fontWeight: 700, borderRadius: 2 }}
                        />
                      ) : (
                        <Chip
                          label="Unassigned"
                          size="small"
                          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={staff.status}
                        size="small"
                        color={staff.status === 'ACTIVE' ? 'success' : 'default'}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(staff)} sx={{ color: '#60a5fa', mr: 1 }}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setStaffToDelete(staff);
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
          {editingStaff ? t('masters.editSecurity') : t('masters.addSecurity')}
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
              label="Security Staff Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Official Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Mobile Number (10 Digits)"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Username (for Security Gate Login)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label={editingStaff ? 'New Password (leave blank to keep current)' : 'Password (min 6 characters)'}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!editingStaff}
            />

            <TextField
              fullWidth
              select
              label="Assign Campus Gate (Optional)"
              value={assignedGateId}
              onChange={(e) => setAssignedGateId(e.target.value)}
              helperText="Assign a campus checkpoint gate to this staff immediately"
            >
              <MenuItem value="">
                <em>-- No Gate Assigned (Unassigned) --</em>
              </MenuItem>
              {gates.map((g) => (
                <MenuItem key={g.id} value={String(g.id)}>
                  <strong>{g.gateName}</strong> {g.description ? `(${g.description})` : ''}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Account Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ color: '#cbd5e1' }}>
              {t('security.cancel')}
            </Button>
            <Button type="submit" variant="contained" color="warning">
              {t('masters.save')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Security Account"
        message={`Are you sure you want to delete security staff account for "${staffToDelete?.name}"?`}
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
