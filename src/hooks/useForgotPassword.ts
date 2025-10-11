import { authService } from "@/features/auth/api/service";
import { useState } from "react";
import { ForgotPasswordRequest } from "@/features/auth/api/dto/ForgotPasswordRequest";
import { ForgotPasswordResponse } from "@/features/auth/api/dto/ForgotPasswordRespone";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ForgotPasswordResponse | null>(null)

  const forgotPassword = async (payload: ForgotPasswordRequest) => {
    try {
      setLoading(true)
      setError(null)
      const res = await authService.forgotPassword(payload)
      setData(res)
      return res
    } catch (err: any) {
      setError(err.response?.data?.message || "Gửi OTP thất bại!")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { forgotPassword, data, loading, error }
}
