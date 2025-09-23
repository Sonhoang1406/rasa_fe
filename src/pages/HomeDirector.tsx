import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";

export const HomeDirectorPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <>
    <Button onClick={
      () => {
        navigate('/auth');
      }
    }>Login</Button>
  </>;
  return <div>Home</div>;
};
