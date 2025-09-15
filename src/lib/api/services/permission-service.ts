import axiosInstance from "../axios";
import { PERMISSION_ENDPOINTS } from "../endpoints";
import { PermissionListResponse, CreatePermissionRequest, UpdatePermissionRequest } from "@/lib/types/permission-type";

export const permissionService = {
  getAllPermissions: async (query: string): Promise<PermissionListResponse> => {
    const response = await axiosInstance.get(PERMISSION_ENDPOINTS.GET_ALL_PERMISSION(query));
    return response.data;
  },

  createPermission: async (data: CreatePermissionRequest): Promise<void> => {
    await axiosInstance.post(PERMISSION_ENDPOINTS.CREATE_PERMISSION, data);
  },

  updatePermission: async (id: string, data: UpdatePermissionRequest): Promise<void> => {
    await axiosInstance.patch(PERMISSION_ENDPOINTS.UPDATE_PERMISSION(id), data);
  },

  deletePermission: async (id: string): Promise<void> => {
    await axiosInstance.delete(PERMISSION_ENDPOINTS.DELETE_PERMISSION(id));
  },
};