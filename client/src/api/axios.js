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
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Evitar loop infinito
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // No interceptar login
        if (originalRequest?.url?.includes('/login')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/refresh`,
                    { refreshToken }
                );

                const newAccessToken = response.data.token;

                // Guardar nuevo token
                localStorage.setItem("token", newAccessToken);

                // Reintentar request original
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.log("Refresh token inválido");

                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");

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