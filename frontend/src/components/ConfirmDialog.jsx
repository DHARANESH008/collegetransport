import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

export const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel', color = 'error' }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
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
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#94a3b8' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} sx={{ color: '#cbd5e1' }}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color={color}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
