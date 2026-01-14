
import api from './axios';

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/profile/me');
export const updateUser = (userData) => api.put('/profile/update', userData);
