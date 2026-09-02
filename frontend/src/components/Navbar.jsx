import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button
} from '@mui/material';
import { Bus, LogOut, Shield, User, Clock, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import logoImg from '../assets/logo.png';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getRoleBadgeColor = () => {
    if (!user) return 'default';
    if (user.role === 'ROLE_ADMIN') return 'primary';
    if (user.role === 'ROLE_DRIVER') return 'success';
    if (user.role === 'ROLE_SECURITY') return 'warning';
    return 'default';
  };

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.role === 'ROLE_ADMIN') return 'ADMIN';
    if (user.role === 'ROLE_DRIVER') return user.assignedBusNumber ? `DRIVER • BUS #${user.assignedBusNumber}` : 'DRIVER';
    if (user.role === 'ROLE_SECURITY') return user.assignedGateName ? `SECURITY • ${user.assignedGateName.toUpperCase()}` : 'SECURITY';
    return user.role;
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(11, 19, 43, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, minHeight: 70 }}>
        {/* Left: Branding & Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onToggleSidebar && (
            <IconButton
              onClick={onToggleSidebar}
              sx={{ color: '#f8fafc', display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon size={22} />
            </IconButton>
          )}

          <Box
            component="img"
            src={logoImg}
            alt="Shree Venkateshwara Logo"
            sx={{
              height: 48,
              width: 'auto',
              objectFit: 'contain',
              borderRadius: 1,
              filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))'
            }}
          />

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1rem', md: '1.2rem' },
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {t('app.collegeName')}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#60a5fa',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'block'
              }}
            >
              {t('app.title')}
            </Typography>
          </Box>
        </Box>

        {/* Right: Live Clock, Role Badge, Language Switcher, User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {/* Live Date & Time Display */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.8,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Clock size={16} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.8rem' }}>
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} • {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </Typography>
          </Box>

          {/* Role Badge */}
          {user && (
            <Chip
              label={getRoleLabel()}
              color={getRoleBadgeColor()}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.04em',
                px: 0.5,
                borderRadius: 2,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
              }}
            />
          )}

          {/* Multilingual Switcher */}
          <LanguageSwitcher />

          {/* User Avatar & Logout Dropdown */}
          {user && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  p: 0.5,
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: '#3b82f6' }
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#3b82f6',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    minWidth: 220,
                    boxShadow: '0 20px 30px rgba(0,0,0,0.5)'
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    logout();
                  }}
                  sx={{
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.2,
                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                  }}
                >
                  <LogOut size={18} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {t('nav.logout')}
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
