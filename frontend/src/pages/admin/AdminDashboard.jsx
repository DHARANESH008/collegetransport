import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Bus,
  Users,
  ShieldCheck,
  MapPin,
  DoorOpen,
  Navigation,
  Gauge,
  CheckCircle2,
  Clock,
  RotateCw,
  TrendingUp,
  FileText,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { StatCard } from '../../components/StatCard';
import { BusSearchCard } from '../../components/BusSearchCard';
import { useNavigate } from 'react-router-dom';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds for live operations
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              {t('dashboard.title')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.4, borderRadius: 2, backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span className="pulse-indicator" />
              <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 800, fontSize: '0.75rem' }}>
                LIVE TELEMETRY
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            {t('dashboard.subtitle')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Tooltip title={t('dashboard.refresh')}>
            <Button
              variant="outlined"
              onClick={fetchStats}
              startIcon={<RotateCw size={16} className={refreshing ? 'animate-spin' : ''} />}
              sx={{ borderRadius: 3, borderColor: 'rgba(255, 255, 255, 0.15)', color: '#cbd5e1' }}
            >
              {t('dashboard.refresh')}
            </Button>
          </Tooltip>

          <Button
            variant="contained"
            onClick={() => navigate('/admin/reports')}
            startIcon={<FileText size={18} />}
            sx={{ borderRadius: 3 }}
          >
            {t('nav.reports')}
          </Button>
        </Box>
      </Box>

      {/* Row 1: Key Telemetry Counters (10 KPIs required by prompt) */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.totalBuses')}
            value={stats?.totalBuses ?? 0}
            icon={<Bus size={24} />}
            color="#3b82f6"
            subtitle="Fleet Capacity: 0-150"
            delay={0.05}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.totalDrivers')}
            value={stats?.totalDrivers ?? 0}
            icon={<Users size={24} />}
            color="#10b981"
            subtitle="1-to-1 Assigned"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.totalSecurity')}
            value={stats?.totalSecurityStaff ?? 0}
            icon={<ShieldCheck size={24} />}
            color="#f59e0b"
            subtitle="Gate Staff Active"
            delay={0.15}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.totalRoutes')}
            value={stats?.totalRoutes ?? 0}
            icon={<MapPin size={24} />}
            color="#8b5cf6"
            subtitle="Erode, Tiruppur, etc."
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.totalGates')}
            value={stats?.totalGates ?? 0}
            icon={<DoorOpen size={24} />}
            color="#ec4899"
            subtitle="Main, South, North"
            delay={0.25}
          />
        </Grid>

        {/* Today's Real-Time Operations Counters */}
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.todayActiveBuses')}
            value={stats?.todayActiveBuses ?? 0}
            icon={<Activity size={24} />}
            color="#06b6d4"
            subtitle="On Road Today"
            delay={0.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.todayStudents')}
            value={stats?.todayStudentCount ?? 0}
            icon={<Users size={24} />}
            color="#10b981"
            subtitle="Students Transported"
            delay={0.35}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.todayDistance')}
            value={`${stats?.todayDistance ?? 0} KM`}
            icon={<Gauge size={24} />}
            color="#3b82f6"
            subtitle="Cumulative Distance"
            delay={0.4}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.runningTrips')}
            value={stats?.runningTrips ?? 0}
            icon={<Navigation size={24} />}
            color="#f59e0b"
            subtitle="Live in Transit"
            delay={0.45}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title={t('dashboard.completedTrips')}
            value={stats?.completedTrips ?? 0}
            icon={<CheckCircle2 size={24} />}
            color="#10b981"
            subtitle="Trips Concluded"
            delay={0.5}
          />
        </Grid>
      </Grid>

      {/* Row 2: Real-Time Bus Inspector (0–150) */}
      <BusSearchCard />

      {/* Row 3: Visual Analytics (Recharts) */}
      <Grid container spacing={3}>
        {/* Bus-wise Distance Bar Chart */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%', borderRadius: 4, p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                {t('dashboard.busDistanceChart')}
              </Typography>
              <TrendingUp size={20} color="#3b82f6" />
            </Box>
            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.busWiseDistance || []}>
                  <XAxis dataKey="busNumber" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <ChartTooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}
                    itemStyle={{ color: '#60a5fa', fontWeight: 700 }}
                  />
                  <Bar dataKey="distance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* 7-Day Distance & Student Trend Area Chart */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%', borderRadius: 4, p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                {t('dashboard.weeklyTrendChart')}
              </Typography>
              <Gauge size={20} color="#10b981" />
            </Box>
            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.weeklyDistanceTrend || []}>
                  <defs>
                    <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorStud" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <ChartTooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}
                  />
                  <Area type="monotone" dataKey="distance" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorDist)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Route-wise Student Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 4, p: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', mb: 2 }}>
              {t('dashboard.routeStudentsChart')}
            </Typography>
            <Box sx={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.routeWiseStudents || []}
                    dataKey="students"
                    nameKey="route"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ route, students }) => `${route}: ${students}`}
                  >
                    {(stats?.routeWiseStudents || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Trip Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 4, p: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', mb: 2 }}>
              {t('dashboard.tripStatusChart')}
            </Typography>
            <Box sx={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.tripStatusDistribution || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    label
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#64748b" />
                  </Pie>
                  <ChartTooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
