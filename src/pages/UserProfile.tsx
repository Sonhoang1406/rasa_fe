import { UserProfileForm } from "@/components";
import { useUserStore } from "@/store/user-store";
import { Navigate } from "react-router-dom";
export const UserProfile = () => {
  const user = useUserStore((state) => state.user);

  return <UserProfileForm />;
};
