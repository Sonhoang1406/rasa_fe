import axios from "axios";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints.tsx";
import { useUserStore } from "@/store/user-store";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api",
  withCredentials: true, // Dùng cookie để gửi/nhận token
  headers: {
    "Content-Type": "application/json",
    'x-platform': 'web'
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post(AUTH_ENDPOINTS.REFRESH_TOKEN);

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        useUserStore.getState().clearUser();
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
