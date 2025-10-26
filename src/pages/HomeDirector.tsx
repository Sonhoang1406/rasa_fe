import { HomeChatDemoWithoutLogin } from "@/components/home_chat_without_login";
import { HomeChatDemo } from "@/features/chat/pages/HomeChatPageDemo";
import { useAuthStore } from "@/store/auth";

export const HomeDirectorPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) return <HomeChatDemoWithoutLogin />;
  
  return <HomeChatDemo />;
};
