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
  InputAdornment,
  Avatar,
  Grid
} from '@mui/material';
import { Users, Plus, Edit, Trash2, Search, Phone, Mail, Bus, FileText, Droplet, MapPin, Eye, ShieldCheck, User } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { NotificationToast } from '../../components/NotificationToast';

export const DriverMasterPage = () => {
  const { t } = useLanguage();

  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingDriver, setViewingDriver] = useState(null);

  const [editingDriver, setEditingDriver] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [assignedBusId, setAssignedBusId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [formError, setFormError] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [drvList, busList] = await Promise.all([
        adminService.getDrivers(),
        adminService.getBuses()
      ]);
      setDrivers(drvList || []);
      setBuses(busList || []);
    } catch (err) {
      setToast({ open: true, message: 'Failed to load drivers', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (driver = null) => {
    setFormError('');
    if (driver) {
      setEditingDriver(driver);
      setName(driver.name || '');
      setEmail(driver.email || '');
      setMobileNumber(driver.mobileNumber || '');
      setLicenseNumber(driver.licenseNumber || '');
      setBloodGroup(driver.bloodGroup || 'O+');
      setAddress(driver.address || '');
      setPhotoUrl(driver.photoUrl || '');
      setUsername(driver.username || '');
      setPassword('');
      setAssignedBusId(driver.assignedBusId ? String(driver.assignedBusId) : '');
      setStatus(driver.status || 'ACTIVE');
    } else {
      setEditingDriver(null);
      setName('');
      setEmail('');
      setMobileNumber('');
      setLicenseNumber('');
      setBloodGroup('O+');
      setAddress('');
      setPhotoUrl('');
      setUsername('');
      setPassword('');
      setAssignedBusId('');
      setStatus('ACTIVE');
    }
    setDialogOpen(true);
  };

  const handleViewDriver = (driver) => {
    setViewingDriver(driver);
    setViewDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      name: name.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim(),
      licenseNumber: licenseNumber.trim(),
      bloodGroup: bloodGroup,
      address: address.trim(),
      photoUrl: photoUrl.trim(),
      username: username.trim(),
      password: password ? password.trim() : undefined,
      assignedBusId: assignedBusId ? parseInt(assignedBusId, 10) : null,
      status
    };

    if (!editingDriver && (!password || password.length < 6)) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      if (editingDriver) {
        await adminService.updateDriver(editingDriver.id, payload);
        setToast({ open: true, message: `Driver "${name}" updated successfully`, severity: 'success' });
      } else {
        await adminService.createDriver(payload);
        setToast({ open: true, message: `Driver "${name}" created successfully`, severity: 'success' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save driver');
    }
  };

  const handleDelete = async () => {
    if (!driverToDelete) return;
    try {
      await adminService.deleteDriver(driverToDelete.id);
      setToast({ open: true, message: `Driver "${driverToDelete.name}" deleted`, severity: 'success' });
      setDeleteConfirmOpen(false);
      setDriverToDelete(null);
      fetchData();
    } catch (err) {
      setToast({ open: true, message: 'Failed to delete driver', severity: 'error' });
    }
  };

  const filtered = drivers.filter((d) =>
    (d.name && d.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.mobileNumber && d.mobileNumber.includes(searchTerm)) ||
    (d.username && d.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.licenseNumber && d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.bloodGroup && d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()))
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff'
            }}
          >
            <Users size={22} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {t('masters.driverTitle')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Driver License, Blood Group, Address, Contact & Bus Assignments
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {t('masters.addDriver')}
        </Button>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: 2, borderRadius: 3.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Driver Name, License No, Blood Group, Phone or Username..."
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

      {/* Driver List Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Driver Profile</TableCell>
                <TableCell>Username / ID</TableCell>
                <TableCell>License No</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Assigned Bus</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    No driver accounts found matching search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((driver) => (
                  <TableRow key={driver.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={driver.photoUrl}
                          alt={driver.name}
                          sx={{
                            width: 44,
                            height: 44,
                            bgcolor: '#10b981',
                            fontWeight: 800,
                            border: '2px solid rgba(16, 185, 129, 0.4)'
                          }}
                        >
                          {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                            {driver.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                            {driver.address || 'SVGI Campus Residence'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#60a5fa', fontWeight: 800 }}>
                      @{driver.username}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <FileText size={14} color="#38bdf8" />
                        <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 700 }}>
                          {driver.licenseNumber || 'TN-33-2018-0098'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Droplet size={14} color="#ef4444" />}
                        label={driver.bloodGroup || 'O+'}
                        size="small"
                        sx={{
                          fontWeight: 900,
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: 2
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Phone size={14} color="#10b981" />
                          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 700 }}>
                            {driver.mobileNumber}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Mail size={12} color="#94a3b8" />
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {driver.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {driver.assignedBusNumber != null ? (
                        <Chip
                          icon={<Bus size={14} />}
                          label={`Bus #${driver.assignedBusNumber} (${driver.assignedRouteName || 'Route'})`}
                          size="small"
                          color="primary"
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
                        label={driver.status}
                        size="small"
                        color={driver.status === 'ACTIVE' ? 'success' : 'default'}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleViewDriver(driver)} sx={{ color: '#38bdf8', mr: 0.5 }}>
                        <Eye size={16} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleOpenDialog(driver)} sx={{ color: '#60a5fa', mr: 0.5 }}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setDriverToDelete(driver);
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
        maxWidth="md"
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
        <DialogTitle sx={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1 }}>
          <User size={20} color="#10b981" />
          {editingDriver ? t('masters.editDriver') : t('masters.addDriver')}
        </DialogTitle>
        <Box component="form" onSubmit={handleSave}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formError && (
              <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
                {formError}
              </Typography>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Driver Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Phone Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Driving License Number"
                  placeholder="e.g. TN-33-2018-009876"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Blood Group"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                >
                  {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
                    <MenuItem key={bg} value={bg}>
                      🩸 {bg}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Residential Address"
                  placeholder="Door No, Street, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Official Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Driver Photo URL (Optional Avatar)"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username (e.g. DR25)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={editingDriver ? 'New Password (leave blank to keep current)' : 'Password (e.g. 25+svgi)'}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingDriver}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Assign Bus (Optional)"
                  value={assignedBusId}
                  onChange={(e) => setAssignedBusId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>-- No Bus Assigned (Unassigned) --</em>
                  </MenuItem>
                  {buses.map((b) => (
                    <MenuItem key={b.id} value={String(b.id)}>
                      <strong>Bus #{b.busNumber}</strong> — {b.registrationNumber} ({b.routeName || 'Campus Route'})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
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
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ color: '#cbd5e1' }}>
              {t('security.cancel')}
            </Button>
            <Button type="submit" variant="contained" color="secondary">
              {t('masters.save')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Driver Detail View Modal */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            p: 1
          }
        }}
      >
        {viewingDriver && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={viewingDriver.photoUrl}
                alt={viewingDriver.name}
                sx={{ width: 50, height: 50, bgcolor: '#10b981', fontWeight: 900 }}
              >
                {viewingDriver.name ? viewingDriver.name.charAt(0).toUpperCase() : 'D'}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#f8fafc' }}>
                  {viewingDriver.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 700 }}>
                  Username: @{viewingDriver.username}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      DRIVING LICENSE NO
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#38bdf8', mt: 0.3 }}>
                      {viewingDriver.licenseNumber || 'TN-33-2018-0098'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      BLOOD GROUP
                    </Typography>
                    <Chip
                      icon={<Droplet size={14} color="#ef4444" />}
                      label={viewingDriver.bloodGroup || 'O+'}
                      size="small"
                      sx={{
                        mt: 0.3,
                        fontWeight: 900,
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171'
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      MOBILE NUMBER
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#10b981', mt: 0.3 }}>
                      📞 {viewingDriver.mobileNumber}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      ASSIGNED BUS
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#fbbf24', mt: 0.3 }}>
                      🚌 {viewingDriver.assignedBusNumber ? `Bus #${viewingDriver.assignedBusNumber}` : 'Unassigned'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      OFFICIAL EMAIL
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#e2e8f0', mt: 0.3 }}>
                      ✉️ {viewingDriver.email}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      RESIDENTIAL ADDRESS
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#cbd5e1', mt: 0.3 }}>
                      🏠 {viewingDriver.address || 'No. 12 College Road, Gobichettipalayam, Erode - 638452'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setViewDialogOpen(false)} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Driver Account"
        message={`Are you sure you want to delete driver account for "${driverToDelete?.name}"?`}
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
