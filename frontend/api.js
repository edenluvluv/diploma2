import axios from 'axios';

// Создание базового URL для API-запросов
const api = axios.create({
  baseURL: 'https://diploma2-backend1.onrender.com/api', // Твой бэкенд URL
});

export default api;
