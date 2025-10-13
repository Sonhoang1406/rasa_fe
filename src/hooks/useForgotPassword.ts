import { useState } from "react"
import axios from "axios"
import { authService } from "@/features/auth/api/service"
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "@/features/auth/api/dto/ForgotPassword"

export function useForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ForgotPasswordResponse | null>(null)
  const [success, setSuccess] = useState(false)

  const forgotPassword = async (payload: ForgotPasswordRequest) => {
    setLoading(true)
    setError(null)
    setData(null)
    setSuccess(false)

    try {
      // Gọi API
      const res = await authService.forgotPassword(payload)
      const result = res?.data?.data || res // fallback
      setData(result)
      setSuccess(true)

      return result
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message || "Gửi mã OTP thất bại! Vui lòng thử lại."
        setError(message)
      } else {
        setError("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.")
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    forgotPassword,
    data,
    loading,
    error,
    success,
  }
}
