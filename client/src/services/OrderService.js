/**
 * src/services/orderService.js
 * Axios instance + GET and POST /api/order
 */

import axios from 'axios';
require("dotenv").config();

const api = axios.create({
  baseURL: `${process.env.Base_API_URL}/api/order`, // ← replace with your server URL
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token on every request
api.interceptors.request.use(
  async (config) => {
    // Uncomment when AsyncStorage token is ready:
    // const token = await AsyncStorage.getItem('auth_token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);

// Normalise all errors to readable messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      const msg =
        err.response.data?.message ||
        err.response.data?.error ||
        `Server error (${err.response.status})`;
      return Promise.reject(new Error(msg));
    }
    if (err.request)
      return Promise.reject(new Error('Network error. Check your connection.'));
    return Promise.reject(new Error(err.message || 'Unexpected error.'));
  },
);

/** GET /api/order */
export const getOrders = async () => {
  const res = await api.get('/api/order');
  return res.data;
};

/**
 * POST /api/order
 * @param {{ order_date: string, booking_type: string, items: Array }} payload
 */
export const createOrder = async (payload) => {
  const res = await api.post('/api/order', payload);
  return res.data;
};

export default api;