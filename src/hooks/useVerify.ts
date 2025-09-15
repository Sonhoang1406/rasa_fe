import { authService } from "@/lib/api/services"
import type { VerifyRequest } from "@/lib/types/auth-type"
import { useNavigate } from "react-router-dom"

export const useVerify = () => {
    const navigate = useNavigate()

    const verify = async (data: VerifyRequest) => {
        const response = await authService.verify(data)
        navigate("/auth")
       return response
    }
    return {
        verify
    }
}