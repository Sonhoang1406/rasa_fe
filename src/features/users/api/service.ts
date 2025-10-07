import axiosInstance from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";
import { IUser } from "@/interfaces/user.interface";
import { User } from "./dto/User";

export const userService = {

    getAllUsers: async (): Promise<User[]> => {
        const response = await axiosInstance.get(ENDPOINTS.USER_ENDPOINTS.GET_ALL_USERS);
        return response.data.data;
    }

};
