import api from '../../api/axios';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from './types';

export const authApi = {
  // Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Đăng ký
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Làm mới token
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // Quên mật khẩu
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  // Đặt lại mật khẩu
  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },

  // Xác thực email
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },
};
