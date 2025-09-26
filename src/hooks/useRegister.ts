"use client";

import { useState } from "react";
import { authService } from "@/features/auth/api/service";
import type { RegisterRequest, RegisterResponse } from "@/features/auth/api/dto/register.dto";
import { AxiosError } from "axios";

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: RegisterRequest) : Promise<RegisterResponse | null> => {
        console.log("Bắt đầu gọi API đăng ký", data);
        setIsLoading(true);
        setError(null);
        
        try {
        const response = await authService.register(data);
        console.log("Response từ API:", response);
        return response;

        } catch (err: unknown) {
            const error = err as AxiosError<any>;
            console.error("Registration error:", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.data?.errors) {
                // Xử lý lỗi validation từ backend
                const errorMessages = Object.values(error.response.data.errors);
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
