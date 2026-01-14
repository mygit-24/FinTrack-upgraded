import api from './axios';

const API = api.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, //  הטוקן נשמר ב־cookie
});

export const getAllTransactions = () => API.get('/transactions');
export const createTransaction = (data) => API.post('/transactions', data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const getExpenseCategories = () =>  API.get('/meta/categories');


