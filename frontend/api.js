import axios from 'axios';
const api = axios.create({
  baseURL: 'https://diploma2-backend1.onrender.com/api', 
});

export default api;
