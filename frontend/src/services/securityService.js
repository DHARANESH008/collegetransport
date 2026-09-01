import api from './api';

export const securityService = {
  getGateInfo: async () => {
    const response = await api.get('/security/gate-info');
    return response.data.data;
  },

  recordBusEntry: async (busNumber) => {
    const response = await api.post('/security/bus-entry', { busNumber });
    return response.data;
  },

  updateBusEntryNumber: async (id, newBusNumber) => {
    const response = await api.put(`/security/bus-entry/${id}`, { newBusNumber });
    return response.data;
  },

  getTodayEntries: async () => {
    const response = await api.get('/security/today-entries');
    return response.data.data;
  },

  getBuses: async () => {
    const response = await api.get('/security/buses');
    return response.data.data;
  }
};
