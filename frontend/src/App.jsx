import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { getAppTheme } from './theme/theme';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { AdminRegisterPage } from './pages/auth/AdminRegisterPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BusMasterPage } from './pages/admin/BusMasterPage';
import { DriverMasterPage } from './pages/admin/DriverMasterPage';
import { SecurityMasterPage } from './pages/admin/SecurityMasterPage';
import { RouteMasterPage } from './pages/admin/RouteMasterPage';
import { GateMasterPage } from './pages/admin/GateMasterPage';
import { AssignmentsPage } from './pages/admin/AssignmentsPage';
import { ReferenceIdPage } from './pages/admin/ReferenceIdPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { MaintenancePage } from './pages/admin/MaintenancePage';
import { SecurityDashboard } from './pages/security/SecurityDashboard';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { BusSearchCard } from './components/BusSearchCard';

// Main ERP Layout with Topbar & Sidebar
const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0b132b' }}>
      <Navbar onToggleSidebar={() => setMobileOpen(!mobileOpen)} />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: '100%',
            overflowX: 'hidden'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

// Route Guard
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'ROLE_DRIVER') return <Navigate to="/driver" replace />;
    if (user.role === 'ROLE_SECURITY') return <Navigate to="/security" replace />;
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
};

export default function App() {
  const theme = getAppTheme('dark');
  const { user } = useAuth();

  const getDefaultRedirect = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN') return '/admin';
    if (user.role === 'ROLE_DRIVER') return '/driver';
    if (user.role === 'ROLE_SECURITY') return '/security';
    return '/login';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={getDefaultRedirect()} replace />} />
        <Route path="/register-admin" element={<AdminRegisterPage />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/search" element={<BusSearchCard />} />
          <Route path="/admin/buses" element={<BusMasterPage />} />
          <Route path="/admin/drivers" element={<DriverMasterPage />} />
          <Route path="/admin/security" element={<SecurityMasterPage />} />
          <Route path="/admin/routes" element={<RouteMasterPage />} />
          <Route path="/admin/gates" element={<GateMasterPage />} />
          <Route path="/admin/assignments" element={<AssignmentsPage />} />
          <Route path="/admin/reference-ids" element={<ReferenceIdPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/maintenance" element={<MaintenancePage />} />
        </Route>

        {/* Security Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_SECURITY', 'ROLE_ADMIN']} />}>
          <Route path="/security" element={<SecurityDashboard />} />
          <Route path="/security/entries" element={<SecurityDashboard />} />
        </Route>

        {/* Driver Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_DRIVER', 'ROLE_ADMIN']} />}>
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/driver/history" element={<DriverDashboard />} />
        </Route>

        {/* Root Fallback */}
        <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
      </Routes>
    </ThemeProvider>
  );
}
