import axios from 'axios';

// Instância do Axios apontando para a URL base da API
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Interceptador que injeta o token JWT em toda requisição automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
