import axiosInstance from "@/api/axios";
import { LoginRequest, LoginResponse } from "./dto/login.dto";
import ENDPOINTS from "@/api/endpoints";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH_ENDPOINTS.LOGIN, data);
    localStorage.setItem('authToken', response.data.data.accessToken);
    return response.data?.data ?? response.data;
  },
}