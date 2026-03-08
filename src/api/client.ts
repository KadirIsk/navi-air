import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8899/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.warn('Oturum süresi doldu, lütfen tekrar giriş yapın.');
    }

    console.error('API Error:', error.response?.data?.message || error.message);
    
    return Promise.reject(error);
  }
);

export default client;
