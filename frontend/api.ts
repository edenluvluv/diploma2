import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE!;

const api = axios.create({
  baseURL: API_BASE + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
