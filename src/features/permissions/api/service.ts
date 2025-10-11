import axiosInstance from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";
import { ListPermissionResponse } from "./dto/permissions.dto";

export const permissionsService = {
    fetchPermissions: async (query: string): Promise<ListPermissionResponse> => {
        const response = await axiosInstance.get(`${ENDPOINTS.PERMISSION_ENDPOINTS.GET_ALL_PAGINATED}?${query}`);
        return response.data;
    }
}