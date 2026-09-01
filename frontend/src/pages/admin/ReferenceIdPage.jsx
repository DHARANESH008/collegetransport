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
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { KeyRound, Plus, Copy, Check, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationToast } from '../../components/NotificationToast';

export const ReferenceIdPage = () => {
  const { t } = useLanguage();

  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchRefs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReferenceIds();
      setReferences(data || []);
    } catch (err) {
      setToast({ open: true, message: 'Failed to load reference tokens', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefs();
  }, []);

  const handleGenerate = async () => {
    try {
      const newRef = await adminService.generateReferenceId(notes);
      setToast({ open: true, message: `Generated new Reference Token: ${newRef.referenceCode}`, severity: 'success' });
      setDialogOpen(false);
      setNotes('');
      fetchRefs();
    } catch (err) {
      setToast({ open: true, message: 'Failed to generate token', severity: 'error' });
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setToast({ open: true, message: `Copied "${code}" to clipboard`, severity: 'info' });
    setTimeout(() => setCopiedCode(null), 2500);
  };

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
            <KeyRound size={22} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {t('nav.referenceCodes')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              One-Time Cryptographic Tokens Authorizing New Administrator Registrations
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="warning"
          startIcon={<Plus size={18} />}
          onClick={() => setDialogOpen(true)}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          Generate New Reference Token
        </Button>
      </Box>

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
                <TableCell>Reference Code</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Used By Email</TableCell>
                <TableCell>Used Timestamp</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Copy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {references.map((ref) => (
                <TableRow key={ref.id} hover>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        color: ref.status === 'UNUSED' ? '#fbbf24' : '#94a3b8',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {ref.referenceCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ref.status}
                      size="small"
                      color={ref.status === 'UNUSED' ? 'success' : 'default'}
                      sx={{ fontWeight: 800, borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#cbd5e1' }}>
                    {ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell sx={{ color: '#60a5fa', fontWeight: 600 }}>
                    {ref.usedByEmail || '-'}
                  </TableCell>
                  <TableCell sx={{ color: '#cbd5e1' }}>
                    {ref.usedAt ? new Date(ref.usedAt).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    {ref.notes || '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Copy Token">
                      <IconButton size="small" onClick={() => handleCopy(ref.referenceCode)} sx={{ color: '#fbbf24' }}>
                        {copiedCode === ref.referenceCode ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Generate Dialog */}
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
          Generate Admin Reference Token
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            This will create a unique, single-use Reference ID token. Share this token with an authorized official to enable their admin account registration.
          </Typography>

          <TextField
            fullWidth
            label="Authorization Notes / Department"
            placeholder="e.g. Authorized for Vice Principal / Dean of Student Affairs"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#cbd5e1' }}>
            {t('security.cancel')}
          </Button>
          <Button onClick={handleGenerate} variant="contained" color="warning">
            Generate Token
          </Button>
        </DialogActions>
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
