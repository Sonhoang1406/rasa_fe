
import { UpdateMeRequest } from "@/features/auth/api/dto/UpdateMeRequest";
import { UpdatePasswordRequest } from "@/features/auth/api/dto/UpdatePasswordRequest";
import { authService } from "@/features/auth/api/service";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import toast from "react-hot-toast";

export const useMe = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [user, setUser] = useState<IUser | null>(null);
    const {updateUser} = useAuthStore();
    const user = useAuthStore((state) => state.user);

    // Lấy thông tin user hiện tại
    const getMe = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.getMe();
            updateUser(response);
            console.log("check info user", user);
            
            return response;
        }
        catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Fetching user profile failed."
            );
            throw err; // Re-throw the error for further handling if needed
        }
        finally {
            setIsLoading(false);
        }
    };

    const updateMe = async (data: UpdateMeRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.updateMe(data);
            toast.success("Cập nhập thông tin thành công");
            updateUser(response);
            return response;
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Updating user profile failed."
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updatePassword = async (data: UpdatePasswordRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.updatePassword(data);
            toast.success("Đổi mật khẩu thành công!");
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Đổi mật khẩu thất bại!";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const updateAvatar = async (file: File) => {
        setIsLoading(true);
        try {
            const response = await authService.updateAvatar(file);
            toast.success("Cập nhật ảnh đại diện thành công!");
            updateUser(response);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Cập nhật ảnh đại diện thất bại!";
            setError(errorMessage);
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, user, getMe, updateMe, updatePassword, updateAvatar };
}


