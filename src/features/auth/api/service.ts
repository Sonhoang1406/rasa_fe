import axiosInstance from "@/api/axios";
import { LoginRequest, LoginResponse } from "./dto/login.dto";
import ENDPOINTS from "@/api/endpoints";
import { RegisterRequest, RegisterResponse } from "./dto/register.dto";
import { data } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH_ENDPOINTS.LOGIN, data);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data?.data ?? response.data;
  },

  register: async(data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH_ENDPOINTS.REGISTER, data);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('refreshToken', response.data.data.refreshToken);
    return response.data?.data ?? response.data;
  },
  
  loginWithGoogle: async (token: string) => {
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.AUTH_ENDPOINTS.GOOGLE}`, {token});
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('refreshToken', response.data.data.refreshToken);
    return response.data?.data ?? response.data;
  }
  
}