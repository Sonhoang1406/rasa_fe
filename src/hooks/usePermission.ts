import { useState } from "react";
import { permissionService } from "../lib/api/services/permission-service";
import { PermissionListResponse, CreatePermissionRequest, UpdatePermissionRequest } from "@/lib/types/permission-type";

export const usePermissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async (query: string): Promise<PermissionListResponse> => {
    setIsLoading(true);
    try {
      const response = await permissionService.getAllPermissions(query);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch permissions";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const createPermission = async (data: CreatePermissionRequest) => {
    setIsLoading(true);
    try {
      await permissionService.createPermission(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create permission";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermission = async (id: string, data: UpdatePermissionRequest) => {
    setIsLoading(true);
    try {
      await permissionService.updatePermission(id, data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update permission";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePermission = async (id: string) => {
    setIsLoading(true);
    try {
      await permissionService.deletePermission(id);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete permission";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchPermissions, createPermission, updatePermission, deletePermission, isLoading, error };
};