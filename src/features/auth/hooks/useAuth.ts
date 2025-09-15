"use client";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/features/auth/api/service";
import type { LoginRequest } from "../lib/types/auth-type";
import { userService } from "@/lib/api/services/user-service.ts";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/store/user-store";

export const useAuth = () => {
  const { setId, setUser, clearUser } = useUserStore();
  const user = useUserStore((state) => state.user);
  const credentialId = useUserStore((state) => state.credentialId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Hàm đăng nhập
  const login = useCallback(
    async (data: LoginRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login(data);

        const userProfile = await userService.getProfile();

        setUser(userProfile);
        setId(response.credentialId);
        navigate("/");
        toast.success("Login successful");
        return response;
      } catch (err: any) {
        setError(err.response?.data?.message || "Login failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setId, setUser]
  );

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    // Thực hiện các bước đăng xuất trước khi gọi API
    try {
      await authService.logout();
      clearUser();
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logged out failed");
      console.log("Logout API error (ignored):", err);
    }
    setIsLoading(false);
  };

  return {
    user,
    isLoading,
    error,
    credentialId,
    login,
    logout,
  };
};
