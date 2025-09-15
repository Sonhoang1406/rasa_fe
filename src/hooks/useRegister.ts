"use client";

import { useState } from "react";
import { authService } from "../lib/api/services/auth-service";
import type { RegisterRequest } from "../lib/types/auth-type";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterRequest) => {
    console.log("Bắt đầu gọi API đăng ký", data);
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);

      console.log("Response từ API:", response);
      return response;
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Xử lý lỗi validation từ backend
        const errorMessages = Object.values(err.response.data.errors);
        if (errorMessages.length > 0) {
          setError(errorMessages[0] as string);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
};
