import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});
api.interceptors.request.use((config) => {  
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // No interceptar errores de la ruta de login
    if (error.config?.url?.includes('/login')) {
        return Promise.reject(error);
    }

    // Solo cerrar sesión si hay una respuesta real del servidor con 401
    // (token inválido o expirado). NO actuar si es error de red (!error.response)
    if (error.response?.status === 401) {
        console.log("Token inválido o expirado");
        localStorage.removeItem("token");
        if (window.location.pathname !== '/login') {
            window.location.href = "/login";
        }
    }

    return Promise.reject(error);
});

export default api;