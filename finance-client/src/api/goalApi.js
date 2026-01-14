
import api from './axios'; // axios מותאם עם withCredentials

const API = api.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // הטוקן נשמר ב־cookie
});

// קריאות ל־goals
export const getAllGoals = () => API.get('/goals');
export const createGoal = (data) => API.post('/goals', data);
export const updateGoal = (id, data) => API.put(`/goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);
export const addAmountToGoal = (id, amount) => API.post(`/goals/${id}/add-amount`, { amount });

