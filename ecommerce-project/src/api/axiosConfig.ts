import axios from "axios";

const api = axios.create({
    baseURL: "/",
});


// ------------------
// Request Interceptor
// ------------------
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token && !config.url?.includes("/api/auth/")) {
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

        // Prevent loop
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/api/auth/")
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh_token");

            // No refresh token
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

                originalRequest.headers.Authorization =
                    `Bearer ${response.data.access}`;

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
