import axiosInstance from "../axios";

import type {
  UserListResponse,
  UserResponse,
  UpdateProfileRequest,
  DeviceListResponse, UserProfile,
} from "../../types/user-type";
import { ADMIN_ENDPOINTS, USER_ENDPOINTS } from "../endpoints";

export const userService = {
  // Lấy thông tin profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get(USER_ENDPOINTS.PROFILE, {
      headers: { 'x-platform': 'WEB' }
    });
    return response.data.data;
  },
  // Cập nhật thông tin profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
    const response = await axiosInstance.patch(USER_ENDPOINTS.PROFILE, data, {
      headers: { 'x-platform': 'WEB' }
    });
    return response.data;
  },

  updateAvatar: async (file: File): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.put(
      USER_ENDPOINTS.UPDATE_AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          'x-platform': 'WEB'
        },
      }
    );
    return response.data.data;
  },

  updatePassword: async (data: {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }): Promise<UserResponse> => {
    const response = await axiosInstance.put(
      USER_ENDPOINTS.UPDATE_PASSWORD,
      data,
      {
        headers: { 'x-platform': 'WEB' }
      }
    );
    return response.data.data;
  },

  getAllUsers: async (query: string): Promise<UserListResponse> => {
    const response = await axiosInstance.get(
      ADMIN_ENDPOINTS.GET_ALL_USERS(query),
      {
        headers: { 'x-platform': 'WEB' }
      }
    );
    return response.data;
  },

  banUser: async (id: string) => {
    const response = await axiosInstance.post(ADMIN_ENDPOINTS.BAN_USER(id), {}, {
      headers: { 'x-platform': 'WEB' }
    });
    return response.data.data;
  },

  unbanUser: async (id: string) => {
    const response = await axiosInstance.post(ADMIN_ENDPOINTS.UNBAN_USER(id), {}, {
      headers: { 'x-platform': 'WEB' }
    });
    return response.data.data;
  },

  getUserDevices: async (id: string): Promise<DeviceListResponse> => {
    const response = await axiosInstance.get(
      ADMIN_ENDPOINTS.GET_USER_DEVICES(id),
      {
        headers: { 'x-platform': 'WEB' }
      }
    );
    return response.data;
  },

  logoutDevice: async (id: string, credentials: string[]) => {
    const response = await axiosInstance.delete(
      ADMIN_ENDPOINTS.LOGOUT_USER_DEVICES(id),
      {
        data: { credentials: credentials },
        headers: { 'x-platform': 'WEB' }
      }
    );
    return response.data;
  },
};
