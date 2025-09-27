"use client";

import { useState } from "react";
import { authService } from "@/features/auth/api/service";
import { AxiosError } from "axios";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithGoogle = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.loginWithGoogle(token);
      return res;
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Google login failed");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithGoogle, isLoading, error };
};
