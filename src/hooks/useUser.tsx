import { userService } from "@/lib/api/services/user-service";
import { UpdateProfileRequest, UserListResponse } from "@/lib/types/user-type";

export const useUser = () => {
  const getProfile = async () => {
    try {
      return await userService.getProfile();
    } catch (error) {
      console.error("getProfile error:", error);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      return await userService.updateProfile(data);
    } catch (error) {
      console.error("updateProfile error:", error);
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      return await userService.updateAvatar(file);
    } catch (error) {
      console.error("updateAvatar error:", error);
    }
  };

  const updatePassword = async (data: {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) => {
    try {
      return await userService.updatePassword(data);
    } catch (error) {
      console.error("updatePassword error:", error);
    }
  };

  const getAllUsers = async (query: string): Promise<UserListResponse | undefined> => {
    try {
      return await userService.getAllUsers(query);
    } catch (error) {
      console.error("getAllUsers error:", error);
    }
  };

  const banUser = async (userId: string) => {
    try {
      return await userService.banUser(userId);
    } catch (error) {
      console.error("banUser error:", error);
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      return await userService.unbanUser(userId);
    } catch (error) {
      console.error("unbanUser error:", error);
    }
  };

  const showDevices = async (id: string) => {
    try {
      return await userService.getUserDevices(id);
    } catch (error) {
      console.error("showDevices error:", error);
    }
  };

  const logoutDevice = async (userId: string, credentials: string[]) => {
    try {
      return await userService.logoutDevice(userId, credentials);
    } catch (error) {
      console.error("logoutDevice error:", error);
    }
  };

  return {
    getProfile,
    updateProfile,
    updateAvatar,
    updatePassword,
    getAllUsers,
    banUser,
    unbanUser,
    showDevices,
    logoutDevice,
  };
};
