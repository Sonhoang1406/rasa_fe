import axiosInstance from "@/api/axios";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../../types/auth-type"
export const authService = {
  // Đăng nhập
  login: async (data: any): Promise<any> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, data)
    return response.data?.data ?? response.data
  },
  //logout
  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      localStorage.removeItem("user-storage");
      localStorage.removeItem("credentialId");
      throw error;
    }
  },
  // Register
  register: async (data: any) : Promise<any> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER,data)
    return response.data
  },

  //Verify
  verify: async (data: any) : Promise<void> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY,data)
    return response.data
  },

  //Forgot-password-otp
  forgotPassword: async (data: any): Promise<any> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data)
    return response.data
  },

  //Reset-password
  resetPassword: async (data: any): Promise<any> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, data) 
    return response.data
  }
}