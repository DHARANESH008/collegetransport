import api from './api';

export const adminService = {
  // Dashboard statistics & charts
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data.data;
  },

  // Real-time Bus 0-150 telemetry search
  searchBus: async (busNumber) => {
    const response = await api.get(`/admin/buses/search/${busNumber}`);
    return response.data.data;
  },

  // Bus Master CRUD
  getBuses: async () => {
    const response = await api.get('/admin/buses');
    return response.data.data;
  },
  createBus: async (bus) => {
    const response = await api.post('/admin/buses', bus);
    return response.data;
  },
  updateBus: async (id, bus) => {
    const response = await api.put(`/admin/buses/${id}`, bus);
    return response.data;
  },
  deleteBus: async (id) => {
    const response = await api.delete(`/admin/buses/${id}`);
    return response.data;
  },

  // Driver Master CRUD
  getDrivers: async () => {
    const response = await api.get('/admin/drivers');
    return response.data.data;
  },
  createDriver: async (driver) => {
    const response = await api.post('/admin/drivers', driver);
    return response.data;
  },
  updateDriver: async (id, driver) => {
    const response = await api.put(`/admin/drivers/${id}`, driver);
    return response.data;
  },
  deleteDriver: async (id) => {
    const response = await api.delete(`/admin/drivers/${id}`);
    return response.data;
  },

  // Security Staff Master CRUD
  getSecurityStaff: async () => {
    const response = await api.get('/admin/security');
    return response.data.data;
  },
  createSecurityStaff: async (staff) => {
    const response = await api.post('/admin/security', staff);
    return response.data;
  },
  updateSecurityStaff: async (id, staff) => {
    const response = await api.put(`/admin/security/${id}`, staff);
    return response.data;
  },
  deleteSecurityStaff: async (id) => {
    const response = await api.delete(`/admin/security/${id}`);
    return response.data;
  },

  // Route Master CRUD
  getRoutes: async () => {
    const response = await api.get('/admin/routes');
    return response.data.data;
  },
  createRoute: async (route) => {
    const response = await api.post('/admin/routes', route);
    return response.data;
  },
  updateRoute: async (id, route) => {
    const response = await api.put(`/admin/routes/${id}`, route);
    return response.data;
  },
  deleteRoute: async (id) => {
    const response = await api.delete(`/admin/routes/${id}`);
    return response.data;
  },

  // Gate Master CRUD
  getGates: async () => {
    const response = await api.get('/admin/gates');
    return response.data.data;
  },
  createGate: async (gate) => {
    const response = await api.post('/admin/gates', gate);
    return response.data;
  },
  updateGate: async (id, gate) => {
    const response = await api.put(`/admin/gates/${id}`, gate);
    return response.data;
  },
  deleteGate: async (id) => {
    const response = await api.delete(`/admin/gates/${id}`);
    return response.data;
  },

  // 1-to-1 Assignments
  assignDriverToBus: async (driverId, busId) => {
    const response = await api.post('/admin/assignments/driver-bus', { driverId, busId });
    return response.data;
  },
  assignSecurityToGate: async (securityId, gateId) => {
    const response = await api.post('/admin/assignments/security-gate', { securityId, gateId });
    return response.data;
  },

  // Reference IDs
  getReferenceIds: async () => {
    const response = await api.get('/admin/reference-ids');
    return response.data.data;
  },
  generateReferenceId: async (notes) => {
    const response = await api.post('/admin/reference-ids/generate', { notes });
    return response.data.data;
  },

  // System 3-Month Cleanup
  triggerCleanupNow: async () => {
    const response = await api.post('/maintenance/cleanup-now');
    return response.data;
  },
  getCleanupLogs: async () => {
    const response = await api.get('/maintenance/cleanup-logs');
    return response.data.data;
  }
};
