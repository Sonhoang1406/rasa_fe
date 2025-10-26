import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { IConversation } from "@/interfaces/chat.interface";
import { ChatProvider } from "@/features/chat/context/ChatContext";

export function MainLayout() {
  const location = useLocation();
  const chatbotId = "68e22e6345898f7f46405ecc";
  
  // Chat state for all chat-related pages
  const chatHook = useChat(chatbotId);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);

  const handleConversationSelect = (conversation: IConversation) => {
    setSelectedConversation(conversation);
    chatHook.loadConversationHistory(conversation);
  };

  const handleNewChat = () => {
    setSelectedConversation(null);
    chatHook.startNewConversation();
  };

  // Yêu cầu quyền hiển thị Notification khi load lần đầu
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <ChatProvider
      chatHook={chatHook}
      selectedConversation={selectedConversation}
      onSelectConversation={handleConversationSelect}
      onNewChat={handleNewChat}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="relative">
          <header
            id="app-header"
            className="flex px-4 sticky bg-background top-0 z-50 w-full h-16 shrink-0 items-center shadow-md"
          >
            <SidebarTrigger className="-ml-1 border-[1px]" />
            <div className="flex-1"></div>
          </header>
          <div className="bg-background p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ChatProvider>
  );
}
