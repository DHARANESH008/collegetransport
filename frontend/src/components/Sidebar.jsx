import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  LayoutDashboard,
  Bus,
  Users,
  ShieldCheck,
  MapPin,
  DoorOpen,
  UserCheck,
  Search,
  FileText,
  KeyRound,
  Database,
  History,
  ShieldAlert
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const DRAWER_WIDTH = 260;

export const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!user) return null;

  const role = user.role;

  const adminNavItems = [
    { label: t('nav.dashboard'), path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: t('nav.busSearch'), path: '/admin/search', icon: <Search size={20} /> },
    { label: t('nav.buses'), path: '/admin/buses', icon: <Bus size={20} /> },
    { label: t('nav.drivers'), path: '/admin/drivers', icon: <Users size={20} /> },
    { label: t('nav.security'), path: '/admin/security', icon: <ShieldCheck size={20} /> },
    { label: t('nav.routes'), path: '/admin/routes', icon: <MapPin size={20} /> },
    { label: t('nav.gates'), path: '/admin/gates', icon: <DoorOpen size={20} /> },
    { label: t('nav.assignments'), path: '/admin/assignments', icon: <UserCheck size={20} /> },
    { label: t('nav.reports'), path: '/admin/reports', icon: <FileText size={20} /> },
    { label: t('nav.referenceCodes'), path: '/admin/reference-ids', icon: <KeyRound size={20} /> },
    { label: t('nav.maintenance'), path: '/admin/maintenance', icon: <Database size={20} /> }
  ];

  const driverNavItems = [
    { label: t('driver.title'), path: '/driver', icon: <Bus size={20} /> },
    { label: t('driver.tripHistory'), path: '/driver/history', icon: <History size={20} /> }
  ];

  const securityNavItems = [
    { label: t('security.title'), path: '/security', icon: <ShieldAlert size={20} /> },
    { label: t('security.todayEntries'), path: '/security/entries', icon: <DoorOpen size={20} /> }
  ];

  const getNavItems = () => {
    if (role === 'ROLE_ADMIN') return adminNavItems;
    if (role === 'ROLE_DRIVER') return driverNavItems;
    if (role === 'ROLE_SECURITY') return securityNavItems;
    return [];
  };

  const navItems = getNavItems();

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0b132b',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        p: 2
      }}
    >
      <Box sx={{ px: 1, py: 1.5, mb: 1 }}>
        <Typography
          variant="overline"
          sx={{ color: '#64748b', fontWeight: 800, letterSpacing: '0.1em' }}
        >
          {role === 'ROLE_ADMIN'
            ? 'ADMINISTRATION'
            : role === 'ROLE_DRIVER'
            ? 'DRIVER CONSOLE'
            : 'SECURITY GATE'}
        </Typography>
      </Box>

      <List sx={{ gap: 0.8, display: 'flex', flexDirection: 'column' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  color: isActive ? '#60a5fa' : '#94a3b8',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#f8fafc'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? '#3b82f6' : '#64748b'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 1.5, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
          3-Minute Auto-Retention Policy
        </Typography>
        <Typography variant="caption" sx={{ color: '#10b981', fontSize: '0.7rem' }}>
          • Active Data Lifecycle
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Persistent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: 70, // Below Navbar
            height: 'calc(100% - 70px)'
          }
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
