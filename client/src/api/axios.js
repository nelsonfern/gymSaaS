import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // envía/recibe cookies en cada request
});

// Ya no inyectamos Authorization header — el token viaja en cookie httpOnly
// Interceptor de respuesta: si el access_token expiró (401), intenta un refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Evitar loop infinito
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // No interceptar login ni refresh para evitar loops
        if (
            originalRequest?.url?.includes('/login') ||
            originalRequest?.url?.includes('/refresh')
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            originalRequest._retry = true;

            try {
                // El servidor lee el refresh_token desde su propia cookie httpOnly
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/users/refresh`,
                    {},
                    { withCredentials: true }
                );

                // El servidor renovó la cookie access_token — reintentamos
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh falló (cookie expirada o inválida) → redirigir a login
                if (window.location.pathname !== '/login') {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;