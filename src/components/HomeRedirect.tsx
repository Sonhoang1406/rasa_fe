import { useUserStore } from "@/store/user-store";
import { Navigate } from "react-router-dom";

export function HomeRedirect() {
  const user = useUserStore((state) => state.user);

  if (user) {
    return <Navigate to="/home_chat" replace />;
  }

  return <Navigate to="/public_chat" replace />;
}
