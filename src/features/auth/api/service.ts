import axiosInstance from "@/api/axios";
import { LoginRequest, LoginResponse } from "./dto/login.dto";
import ENDPOINTS from "@/api/endpoints";
import { RegisterRequest } from "./dto/RegisterRequest";
import { RegisterResponse } from "./dto/RegisterResponse";
import { MeResponse } from "./dto/MeResponse";
import { IUser } from "@/interfaces/user.interface";
import { UpdateMeRequest } from "./dto/UpdateMeRequest";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH_ENDPOINTS.LOGIN, data);
    localStorage.setItem('authToken', response.data.data.accessToken);
    return response.data?.data ?? response.data;
  },
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH_ENDPOINTS.REGISTER, data);
    localStorage.setItem('authToken', response.data.data.accessToken);
    return response.data?.data ?? response.data;
  },
  verify: async (otp: string): Promise<any> => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH_ENDPOINTS.VERIFY, { otp });
    return response.data;
  },
    getMe: async (): Promise<IUser> => {
    const response = await axiosInstance.get(ENDPOINTS.AUTH_ENDPOINTS.ME);
    return response.data.data;
  },
    updateMe: async (data: UpdateMeRequest): Promise<IUser> => {
    const response = await axiosInstance.put(ENDPOINTS.AUTH_ENDPOINTS.UPDATE_ME, data);
    return response.data.data;
  }
}