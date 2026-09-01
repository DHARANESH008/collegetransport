import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import { KeyRound, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { motion } from 'framer-motion';
import logoImg from '../../assets/logo.png';

export const AdminRegisterPage = () => {
  const { registerAdmin, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Step 1: Reference ID validation
  const [referenceId, setReferenceId] = useState('');
  const [refValidated, setRefValidated] = useState(false);
  const [validatingRef, setValidatingRef] = useState(false);
  const [refSuccessMsg, setRefSuccessMsg] = useState('');

  // Step 2: Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');

  // Validate Reference ID with DB
  const handleVerifyReference = async () => {
    if (!referenceId.trim()) {
      setError('Please enter a Reference ID');
      return;
    }

    setValidatingRef(true);
    setError('');
    setRefSuccessMsg('');

    try {
      const res = await authService.validateReferenceId(referenceId.trim());
      if (res.success && res.data.valid) {
        setRefValidated(true);
        setRefSuccessMsg(t('auth.refValidSuccess'));
      } else {
        setRefValidated(false);
        setError(res.data?.message || t('auth.refInvalidError'));
      }
    } catch (err) {
      setRefValidated(false);
      setError(err.response?.data?.message || t('auth.refInvalidError'));
    } finally {
      setValidatingRef(false);
    }
  };

  // Submit complete Admin Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!refValidated) {
      setError('Please verify a valid Reference ID before proceeding with registration.');
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    try {
      const res = await registerAdmin({
        referenceId: referenceId.trim(),
        name: name.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        username: username.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim()
      });

      if (res.success) {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, #1e293b 0%, #0b132b 90%)',
        p: 2,
        position: 'relative'
      }}
    >
      <Box sx={{ position: 'absolute', top: 20, right: 24, zIndex: 10 }}>
        <LanguageSwitcher />
      </Box>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '520px', zIndex: 1 }}
      >
        <Card
          sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            borderRadius: 5,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(251, 191, 36, 0.1)',
            p: { xs: 2, sm: 3.5 }
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                component="img"
                src={logoImg}
                alt="Shree Venkateshwara Logo"
                sx={{
                  height: 85,
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.4))',
                  mb: 1.5
                }}
              />

              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                {t('auth.registerTitle')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
                {t('auth.registerSubtitle')}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            {refSuccessMsg && (
              <Alert severity="success" icon={<CheckCircle2 size={20} />} sx={{ mb: 2.5, borderRadius: 3 }}>
                {refSuccessMsg}
              </Alert>
            )}

            {/* Step 1: Reference ID Verification Box */}
            <Box
              sx={{
                p: 2,
                mb: 2.5,
                borderRadius: 3,
                backgroundColor: refValidated ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.08)',
                border: refValidated ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.25)'
              }}
            >
              <Typography variant="caption" sx={{ color: refValidated ? '#34d399' : '#fbbf24', fontWeight: 700, display: 'block', mb: 1 }}>
                STEP 1: DATABASE REFERENCE TOKEN AUTHENTICATION
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={t('auth.referenceId')}
                  value={referenceId}
                  disabled={refValidated}
                  onChange={(e) => {
                    setReferenceId(e.target.value);
                    setRefValidated(false);
                    setRefSuccessMsg('');
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyRound size={16} color="#fbbf24" />
                      </InputAdornment>
                    )
                  }}
                />
                {!refValidated ? (
                  <Button
                    variant="contained"
                    color="warning"
                    disabled={validatingRef || !referenceId.trim()}
                    onClick={handleVerifyReference}
                    sx={{ minWidth: 120, borderRadius: 2.5 }}
                  >
                    {validatingRef ? <CircularProgress size={16} color="inherit" /> : t('auth.validateReference')}
                  </Button>
                ) : (
                  <Chip
                    icon={<CheckCircle2 size={16} />}
                    label="VERIFIED"
                    color="success"
                    sx={{ height: 40, fontWeight: 800, borderRadius: 2.5 }}
                  />
                )}
              </Box>
            </Box>

            {/* Step 2: Admin Registration Fields (Enabled after verification) */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                opacity: refValidated ? 1 : 0.45,
                pointerEvents: refValidated ? 'auto' : 'none'
              }}
            >
              <TextField
                fullWidth
                size="small"
                label={t('auth.fullName')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={16} color="#94a3b8" />
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={t('auth.email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={16} color="#94a3b8" />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label={t('auth.mobileNumber')}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={16} color="#94a3b8" />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              <TextField
                fullWidth
                size="small"
                label={t('auth.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShieldCheck size={16} color="#94a3b8" />
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={t('auth.password')}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={16} color="#94a3b8" />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label={t('auth.confirmPassword')}
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={16} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                color="warning"
                disabled={authLoading || !refValidated}
                sx={{
                  py: 1.3,
                  fontWeight: 800,
                  borderRadius: 3,
                  mt: 1
                }}
              >
                {authLoading ? <CircularProgress size={20} color="inherit" /> : t('auth.registerButton')}
              </Button>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Button
                component={Link}
                to="/login"
                startIcon={<ArrowLeft size={16} />}
                sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}
              >
                {t('auth.backToLogin')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};
