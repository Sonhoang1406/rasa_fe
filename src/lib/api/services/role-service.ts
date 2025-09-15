import axiosInstance from "../axios";
import { ROLE_ENDPOINTS } from "../endpoints";
import { RoleListResponse, CreateRoleRequest, UpdateRoleRequest } from "@/lib/types/role-type";

export const roleService = {
  getAllRoles: async (query: string): Promise<RoleListResponse> => {
    const response = await axiosInstance.get(ROLE_ENDPOINTS.GET_ALL_ROLES(query));
    return response.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<void> => {
    await axiosInstance.post(ROLE_ENDPOINTS.CREATE_ROLE, data);
  },

  updateRole: async (id: string, data: UpdateRoleRequest): Promise<void> => {
    await axiosInstance.patch(ROLE_ENDPOINTS.UPDATE_ROLE(id), data);
  },

  deleteRole: async (id: string): Promise<void> => {
    await axiosInstance.delete(ROLE_ENDPOINTS.DELETE_ROLE(id));
  },
};