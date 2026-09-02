import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Eye, EyeOff, Lock, User, ArrowRight, KeyRound, Zap, Sun, Moon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { motion } from 'framer-motion';
import logoImg from '../../assets/logo.png';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const { currentLang, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [sunlightMode, setSunlightMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const res = await login({ username: username.trim(), password: password.trim(), rememberMe });
      if (res.success && res.data) {
        const role = res.data.role;
        if (role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else if (role === 'ROLE_DRIVER') {
          navigate('/driver');
        } else if (role === 'ROLE_SECURITY') {
          navigate('/security');
        } else {
          navigate('/admin');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#030712',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* 1. TOP FLASH NEWS TICKER BAR */}
      <Box
        sx={{
          backgroundColor: '#020617',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          py: 0.8,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          zIndex: 20
        }}
      >
        <Box
          sx={{
            display: 'flex',
            whiteSpace: 'nowrap',
            width: '100%',
            animation: 'marquee 28s linear infinite',
            '@keyframes marquee': {
              '0%': { transform: 'translateX(100%)' },
              '100%': { transform: 'translateX(-100%)' }
            }
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: sunlightMode ? '#00ff88' : '#00e676',
              fontWeight: 900,
              letterSpacing: '0.08em',
              fontSize: sunlightMode ? '0.82rem' : '0.78rem'
            }}
          >
            {t('app.ticker')}
          </Typography>
        </Box>
      </Box>

      {/* 2. TOP MAIN HEADER BAR */}
      <Box
        sx={{
          backgroundColor: '#060c1e',
          borderBottom: sunlightMode ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          zIndex: 10,
          boxShadow: sunlightMode ? '0 0 20px rgba(0, 229, 255, 0.15)' : 'none'
        }}
      >
        {/* Left: Institution Branding with white logo container */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            className="logo-glowing-ring"
            sx={{
              width: 50,
              height: 50,
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0.4
            }}
          >
            <Box
              component="img"
              src={logoImg}
              alt="SVGI Logo"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Box
                sx={{
                  backgroundColor: 'rgba(6, 182, 212, 0.2)',
                  border: sunlightMode ? '1px solid #00e5ff' : '1px solid rgba(6, 182, 212, 0.4)',
                  color: sunlightMode ? '#00e5ff' : '#22d3ee',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  px: 1.2,
                  py: 0.2,
                  borderRadius: 3,
                  letterSpacing: '0.04em',
                  boxShadow: sunlightMode ? '0 0 10px rgba(0, 229, 255, 0.5)' : 'none'
                }}
              >
                ● SVGI • GOBI
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: sunlightMode ? '#ffffff' : '#94a3b8',
                  fontWeight: 900,
                  fontSize: '0.75rem'
                }}
              >
                . {t('app.location')}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: sunlightMode ? '#00ff88' : '#00e676',
                letterSpacing: '0.02em',
                fontSize: { xs: '1.05rem', md: '1.3rem' },
                lineHeight: 1.2,
                mt: 0.3
              }}
            >
              {t('app.collegeName')}
            </Typography>
          </Box>
        </Box>

        {/* Right: Display Mode & Language Switchers */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Display Mode Pill Switcher */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: sunlightMode ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 4,
              p: 0.4,
              boxShadow: sunlightMode ? '0 0 12px rgba(0, 229, 255, 0.3)' : 'none'
            }}
          >
            <Button
              size="small"
              onClick={() => setSunlightMode(false)}
              startIcon={<Moon size={14} />}
              sx={{
                borderRadius: 3,
                px: 1.5,
                py: 0.4,
                fontSize: '0.75rem',
                fontWeight: 800,
                color: !sunlightMode ? '#ffffff' : '#94a3b8',
                backgroundColor: !sunlightMode ? '#1e293b' : 'transparent',
                boxShadow: !sunlightMode ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              Normal
            </Button>
            <Button
              size="small"
              onClick={() => setSunlightMode(true)}
              startIcon={<Sun size={14} color={sunlightMode ? "#00ff88" : "inherit"} />}
              sx={{
                borderRadius: 3,
                px: 1.5,
                py: 0.4,
                fontSize: '0.75rem',
                fontWeight: 900,
                color: sunlightMode ? '#00ff88' : '#64748b',
                backgroundColor: sunlightMode ? '#0f172a' : 'transparent',
                boxShadow: sunlightMode ? '0 0 12px rgba(0, 255, 136, 0.5)' : 'none'
              }}
            >
              Sunlight
            </Button>
          </Box>

          {/* Dropdown Language Switcher (English, Tamil, Hindi) */}
          <LanguageSwitcher />
        </Box>
      </Box>

      {/* 3. CENTER HERO LOGIN SECTION */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          position: 'relative'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '470px', zIndex: 1 }}
        >
          <Card
            sx={{
              backgroundColor: '#040b1e',
              border: sunlightMode ? '2px solid #00e5ff' : '1px solid rgba(0, 180, 255, 0.35)',
              borderRadius: 5,
              boxShadow: sunlightMode
                ? '0 0 50px rgba(0, 229, 255, 0.3), 0 20px 60px rgba(0, 0, 0, 0.9)'
                : '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 150, 255, 0.15)',
              overflow: 'hidden'
            }}
          >
            {/* Top Pill Badge Header */}
            <Box
              sx={{
                backgroundColor: '#1d4ed8',
                backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                color: '#ffffff',
                textAlign: 'center',
                py: 1.2,
                px: 2,
                fontWeight: 900,
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
              }}
            >
              {t('app.portalName')}
            </Box>

            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              {/* Inner College Branding */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box
                  className="logo-glowing-ring"
                  sx={{
                    width: 78,
                    height: 78,
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1.5,
                    p: 0.5
                  }}
                >
                  <Box
                    component="img"
                    src={logoImg}
                    alt="SVGI Logo"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(59, 130, 246, 0.18)',
                    color: '#60a5fa',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    px: 1.6,
                    py: 0.3,
                    borderRadius: 3,
                    mb: 1,
                    letterSpacing: '0.04em'
                  }}
                >
                  ● SVGI • GOBICHETTIPALAYAM
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    color: '#10b981',
                    letterSpacing: '-0.02em',
                    fontSize: '1.45rem',
                    mb: 0.5
                  }}
                >
                  {t('app.collegeName')}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: '#94a3b8',
                    display: 'block',
                    fontWeight: 600,
                    fontSize: '0.88rem'
                  }}
                >
                  {t('app.unifiedSubtitle')}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

              {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#cbd5e1',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      display: 'block',
                      mb: 0.8,
                      fontSize: '0.82rem'
                    }}
                  >
                    {t('app.usernameLabel')}
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder={t('auth.usernameOrEmail')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={20} color="#10b981" />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#081026',
                        borderRadius: 3,
                        color: '#ffffff',
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.15)'
                        },
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px #081026 inset !important',
                          WebkitTextFillColor: '#ffffff !important',
                          caretColor: '#ffffff'
                        }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#cbd5e1',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      display: 'block',
                      mb: 0.8,
                      fontSize: '0.82rem'
                    }}
                  >
                    {t('app.passwordLabel')}
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder={t('auth.password')}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={20} color="#10b981" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#081026',
                        borderRadius: 3,
                        color: '#ffffff',
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.15)'
                        },
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px #081026 inset !important',
                          WebkitTextFillColor: '#ffffff !important',
                          caretColor: '#ffffff'
                        }
                      }
                    }}
                  />
                </Box>

                {/* Remember Me & Forgot Password */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        size="small"
                        sx={{ color: '#64748b', '&.Mui-checked': { color: '#10b981' } }}
                      />
                    }
                    label={<Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 700 }}>{t('auth.rememberMe')}</Typography>}
                  />
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setForgotOpen(true)}
                    sx={{ color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, p: 0 }}
                  >
                    {t('auth.forgotPassword')}
                  </Button>
                </Box>

                {/* Main Login Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                  sx={{
                    py: 1.6,
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    borderRadius: 3.5,
                    mt: 0.5,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                    color: '#ffffff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                    }
                  }}
                >
                  {loading ? t('auth.signingIn') : t('app.loginBtn')}
                </Button>

                {/* Protected Admin Registration Link */}
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Button
                    component={Link}
                    to="/register-admin"
                    startIcon={<KeyRound size={18} color="#fbbf24" />}
                    sx={{
                      color: '#fbbf24',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      '&:hover': { backgroundColor: 'rgba(251, 191, 36, 0.1)' }
                    }}
                  >
                    {t('auth.adminRegisterLink')}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
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
          Password Recovery Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#94a3b8' }}>
            Driver and Security staff credentials are managed directly by the College Transport Administrator.
            Please contact the Transport Office at <strong>admin@college.edu</strong> or Ext <strong>1025</strong> to reset your password.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setForgotOpen(false)} variant="contained">
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
