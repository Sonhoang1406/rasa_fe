import { User } from "@/features/users/api/dto/User";
import { userService } from "@/features/users/api/service";
import { IUser } from "@/interfaces/user.interface";
import { useState } from "react";

export const useUser = () => {
    //get all users
    const [users, setUsers] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorUser, setErrorUser] = useState<string | null>(null);
    const getAllUsers = async () : Promise<User[]> => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
            return data;
        } catch (error) {
            setErrorUser("Failed to fetch users");
            return [];
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loading,
        errorUser,
        getAllUsers
    };
};
