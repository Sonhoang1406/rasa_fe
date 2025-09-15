import { useState } from "react";
import { roleService } from "../lib/api/services/role-service";
import { RoleListResponse, CreateRoleRequest, UpdateRoleRequest } from "@/lib/types/role-type";

export const useRoles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async (query: string): Promise<RoleListResponse> => {
    setIsLoading(true);
    try {
      const response = await roleService.getAllRoles(query);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch roles";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const createRole = async (data: CreateRoleRequest) => {
    setIsLoading(true);
    try {
      await roleService.createRole(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create role";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (id: string, data: UpdateRoleRequest) => {
    setIsLoading(true);
    try {
      await roleService.updateRole(id, data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update role";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    setIsLoading(true);
    try {
      await roleService.deleteRole(id);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete role";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchRoles, createRole, updateRole, deleteRole, isLoading, error };
};