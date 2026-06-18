import axios from 'axios';

// Instância do Axios apontando para a URL base da API
const api = axios.create({
    baseURL:  import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Interceptador que injeta o token JWT em toda requisição automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptador que detecta token expirado e redireciona para o login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const code = error.response?.data?.code;

            if (code !== 'CREDENCIAIS_INVALIDAS') { 
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;