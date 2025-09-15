
import axiosInstance from "../axios";
import {ENTITIES_ENDPOINTS} from "../endpoints";
import {  EntitiesRequest, EntitiesResponse, Entity } from "@/lib/types/entities-type";


export const entitiesService = {
  getAllEntities: async (query: string): Promise<EntitiesResponse> => {
    try {
      const response = await axiosInstance.get(ENTITIES_ENDPOINTS.GET_ALL_ENTITIES(query));
      console.log("Entities API response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error fetching entities:", error);
      throw new Error("Không thể lấy danh sách entity");
    }
  },

  updateEntities: async (id: string,data: EntitiesRequest): Promise<Entity> => {
    try {
      const response = await axiosInstance.patch(ENTITIES_ENDPOINTS.UPDATE_ENTITIES(id), data);
      return response.data;
    } catch (error) {
      console.error("Error updating entity:", error);
      throw new Error(`Không thể cập nhật entity với ID ${id}`);
    }
  },

  deleteEntities: async (id: string): Promise<Entity> => {
    try {
      const response = await axiosInstance.delete(ENTITIES_ENDPOINTS.DELETE_ENTITIES(id));
      return response.data;
    } catch (error) {
      console.error("Error deleting entity:", error);
      throw new Error(`Không thể xóa entity với ID ${id}`);
    }
  },

  createEntities: async (data: EntitiesRequest): Promise<Entity> => {
    try {
      const response = await axiosInstance.post(ENTITIES_ENDPOINTS.CREATE_ENTITIES, data);
      return response.data;
    } catch (error) {
      console.error("Error creating entity:", error);
      throw new Error("Không thể tạo entity");
    }
  },

  restoreEntities: async (id: string): Promise<Entity> => {
    try {
      const response = await axiosInstance.patch(ENTITIES_ENDPOINTS.RESTORE_ENTITIES(id));
      return response.data;
    } catch (error) {
      console.error("Error restoring entity:", error);
      throw new Error(`Không thể khôi phục entity với ID ${id}`);
    }
  }
};

