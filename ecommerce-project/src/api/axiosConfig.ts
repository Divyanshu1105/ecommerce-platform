import axios from "axios";

const api = axios.create({
    baseURL: "/",
});

const publicRoutes = ['/api/auth/login/', '/api/auth/register/'];

// ------------------
// Request Interceptor
// ------------------
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token && !publicRoutes.some(route => config.url?.includes(route))) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


// ------------------
// Response Interceptor
// ------------------
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/api/auth/refresh/")
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh_token");

            if (!refreshToken) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const response = await api.post("/api/auth/refresh/", {
                    refresh: refreshToken,
                });

                localStorage.setItem("access_token", response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;