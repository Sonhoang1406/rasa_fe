import { LanguageSwicher } from "@/components";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSocket } from "@/hooks/useSocket";
import { useUserStore } from "@/store/user-store";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function MainLayout() {
  const user = useUserStore((state) => state.user);
  const location = useLocation();
  const socket = useSocket();

  // Yêu cầu quyền hiển thị Notification khi load lần đầu
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleTrainingComplete = (data: {
      message: string;
      chatbotId: string;
      jobId: string;
    }) => {

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("✅ Training Complete", {
          body: data.message,
        });
      }
    
      if (
        location.pathname.includes("training") ||
        location.pathname.includes("chatbot") ||
        location.pathname.includes("model")
      )
        window.location.reload();
      console.log("✅ Training completed for chatbot", data.chatbotId);
    };

    const handleTrainingError = (data: {
      message: string;
      error: string;
      chatbotId?: string;
      jobId?: string;
    }) => {
      toast.error(
        data.message || "❌ Có lỗi xảy ra trong quá trình huấn luyện"
      );

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("❌ Training Failed", {
          body: data.message,
        });
      }
      if (
        location.pathname.includes("chatbot") ||
        location.pathname.includes("model")
      )
        window.location.reload();
      console.error("❌ Training error:", data.error, "Job ID:", data.jobId);
    };

    socket.on("training-complete", handleTrainingComplete);
    socket.on("training-error", handleTrainingError);

    return () => {
      socket.off("training-complete", handleTrainingComplete);
      socket.off("training-error", handleTrainingError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  if (!user) return <Navigate to="/public_chat" />;
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        <header
          id="app-header"
          className="flex px-4 sticky bg-background top-0 z-50 w-full h-16 shrink-0 items-center shadow-md"
        >
          <SidebarTrigger className="-ml-1 border-[1px]" />
          <div className="flex-1"></div>
          <LanguageSwicher />
          <div className="w-2"></div>
          <ModeToggle />
        </header>
        <div className="bg-background p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
