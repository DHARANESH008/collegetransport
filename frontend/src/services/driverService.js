import api from './api';

export const driverService = {
  getDriverBusInfo: async () => {
    const response = await api.get('/driver/bus-info');
    return response.data.data;
  },

  startJourney: async (manualStartKm = null, startKmPhoto = null) => {
    const response = await api.post('/driver/start-journey', { manualStartKm, startKmPhoto });
    return response.data.data || response.data;
  },

  saveStudentCount: async (studentCount) => {
    const response = await api.post('/driver/save-students', { studentCount });
    return response.data.data || response.data;
  },

  endJourney: async (endKm, endKmPhoto = null) => {
    const response = await api.post('/driver/end-journey', { endKm, endKmPhoto });
    return response.data.data || response.data;
  },

  getTripHistory: async () => {
    const response = await api.get('/driver/trip-history');
    return response.data.data;
  }
};
