import { authService } from "@/lib/api/services"
import { ResetPasswordRequest } from "@/lib/types/auth-type"
import { useNavigate } from "react-router-dom"

export const useResetPass = () => {
    const navigate = useNavigate();

    const resetPass = async (data: ResetPasswordRequest) => {
        const response = await authService.resetPassword(data)
        navigate('/auth')
        return response
    }
    return {resetPass}
}