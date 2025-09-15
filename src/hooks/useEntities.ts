import { useState, useEffect } from "react";
import { entitiesService } from "@/lib/api/services/entities-service";
import { EntitiesResponse, Entity, EntitiesRequest } from "@/lib/types/entities-type";

export const useEntities = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm gọi API getAllEntities
  const getEntities = async (query: string): Promise<EntitiesResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await entitiesService.getAllEntities(query);
      console.log("Entities API response:", response); 
      if (response.success && Array.isArray(response.data)) {
        setEntities(response.data);
        return response;
      } else {
        throw new Error("Định dạng dữ liệu không hợp lệ từ API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể lấy danh sách entity";
      setError(errorMessage);
      console.error("Lỗi khi lấy entities:", err);
      return {
        success: false,
        data: [],
        message: errorMessage,
        meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xóa entity
  const deleteEntities = async (id: string): Promise<void> => {
    try {
      await entitiesService.deleteEntities(id);
      console.log("Deleted entity ID:", id); // Debug log
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể xóa entity";
      console.error("Lỗi xóa entity:", error);
      throw new Error(errorMessage);
    }
  };


  const updateEntities = async (id: string, data: EntitiesRequest): Promise<Entity> => {
    try {
       const response = await entitiesService.updateEntities(id, data);
       return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể xóa entity";
      console.error("Lỗi update entity:", error);
      throw new Error(errorMessage);
    }
  };

  const createEntities = async (data: EntitiesRequest) => {
    try {
      const response = await entitiesService.createEntities(data);
      return response;
    } catch(error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể tạo entity";
      console.error("Lỗi tạo entity:", error);
      throw new Error(errorMessage);
    }
  };

  const restoreEntities = async (id: string) => {
    try {
      await entitiesService.restoreEntities(id);
      console.log("Restoring entity ID:", id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể khôi phục entity";
      console.error("Không thể khôi phục entity: ", error);
      throw new Error(errorMessage);
    }
  }

  // // Tự động gọi API khi hook được mount
  // useEffect(() => {
  //   getEntities("?page=1&limit=100");
  // }, []);
  //
  // // Hàm làm mới danh sách entities
  // const refreshEntities = () => {
  //   getEntities("?page=1&limit=100");
  // };

  return {
    entities,
    isLoading,
    error,
    getEntities,
    deleteEntities,
    createEntities,
    restoreEntities,
    updateEntities
  };
};