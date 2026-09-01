import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export const NotificationToast = ({ open, message, severity = 'success', onClose, autoHideDuration = 4000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: 3,
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          fontSize: '0.9rem'
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
