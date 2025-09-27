"use client";

import { useState } from "react";
import { authService } from "@/features/auth/api/service";
import { AxiosError } from "axios";

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithGoogle = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.loginWithGoogle(token);
      // lưu JWT vào localStorage hoặc context
      localStorage.setItem("auth_token", res.token);
      return res;
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{message: string}>;
      if (axiosErr.response?.data?.message) {
        setError(axiosErr.response.data.message);
      } else {
        setError("Google login failed. Please try again.");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithGoogle, isLoading, error };
};
