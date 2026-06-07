import api from './axiosInstance';

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getSavedSchemes: () => api.get('/user/saved-schemes'),
  getSavedIds: () => api.get('/user/saved-ids'),
  saveScheme: (id) => api.post(`/user/save-scheme/${id}`),
  removeSavedScheme: (id) => api.delete(`/user/save-scheme/${id}`),
};

// Scheme APIs
export const schemeAPI = {
  getSchemes: (params) => api.get('/schemes', { params }),
  getSchemeById: (id) => api.get(`/schemes/${id}`),
  getCategories: () => api.get('/schemes/categories'),
};

// Recommendation APIs
export const recommendationAPI = {
  getRecommendations: () => api.get('/recommendations'),
  getQuickRecommendations: () => api.get('/recommendations/quick'),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  getHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history'),
};

// Eligibility APIs
export const eligibilityAPI = {
  check: (schemeId) => api.post(`/eligibility/check/${schemeId}`),
  getHistory: () => api.get('/eligibility/history'),
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getSchemes: (params) => api.get('/admin/schemes', { params }),
  createScheme: (data) => api.post('/admin/schemes', data),
  updateScheme: (id, data) => api.put(`/admin/schemes/${id}`, data),
  deleteScheme: (id) => api.delete(`/admin/schemes/${id}`),
  getUsers: (params) => api.get('/admin/users', { params }),
};

// Application Tracker APIs
export const applicationAPI = {
  getAll: () => api.get('/applications'),
  upsert: (data) => api.post('/applications', data),
  remove: (id) => api.delete(`/applications/${id}`),
};
