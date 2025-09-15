import { useUserStore } from "@/store/user-store";
import { Navigate, Outlet } from "react-router-dom";

export const AuthLayout = () => {
  const user = useUserStore((state) => state.user);
  if (user) return <Navigate to="/" />;
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 ">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
};
