import axiosInstance from "../axios"
import { AUTH_ENDPOINTS } from "../endpoints"
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
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, data)
    return response.data.data;
  },
  //logout
  logout: async (): Promise<void> => {
    try {

      await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);

    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);

      localStorage.removeItem("user-storage");
      localStorage.removeItem("credentialId");
      throw error; // Ném lỗi để useAuth xử lý
    }
  },
  // Register
  register: async (data: RegisterRequest) : Promise<RegisterResponse> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER,data)
    return response.data
  },

  //Verify
  verify: async (data: VerifyRequest) : Promise<void> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY,data)
    return response.data
  },

  //Forgot-password-otp
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data)
    return response.data
  },

  //Reset-password
  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, data) 
    return response.data
  }
}