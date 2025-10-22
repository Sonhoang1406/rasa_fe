import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useConversations } from "../../../hooks/useConversations";
import { IConversation } from "@/interfaces/chat.interface";
import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";

interface ChatSidebarProps {
  userId: string;
  currentConversationId?: string | null;
  onConversationSelect: (conversation: IConversation) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  userId,
  currentConversationId,
  onConversationSelect,
  onNewChat,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { conversations, loading, error, meta, loadMore } =
    useConversations(userId);

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;

    // Tìm kiếm trong tin nhắn cuối cùng của user
    const lastUserMessage = conversation.chat
      .filter((msg) => msg.role === "user")
      .pop();

    if (lastUserMessage) {
      const message =
        typeof lastUserMessage.message === "string"
          ? lastUserMessage.message
          : lastUserMessage.message[0] || "";

      return message.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return false;
  });

  const getConversationTitle = (conversation: IConversation) => {
    const firstUserMessage = conversation.chat.find(
      (msg) => msg.role === "user"
    );

    if (firstUserMessage) {
      const message =
        typeof firstUserMessage.message === "string"
          ? firstUserMessage.message
          : firstUserMessage.message[0];
      return message.length > 30 ? `${message.substring(0, 30)}...` : message;
    }

    return "Cuộc trò chuyện mới";
  };

  const getLastMessage = (conversation: IConversation) => {
    const lastMessage = conversation.chat[conversation.chat.length - 1];
    if (lastMessage) {
      const message =
        typeof lastMessage.message === "string"
          ? lastMessage.message
          : lastMessage.message[0];
      return message.length > 50 ? `${message.substring(0, 50)}...` : message;
    }
    return "";
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        // locale: vi,
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col h-full border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Đoạn chat</h2>
          <button
            onClick={onNewChat}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Đoạn chat mới"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đoạn chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-400">Đang tải...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-400">
            <p>{error}</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có cuộc trò chuyện nào</p>
            <p className="text-sm mt-1">Bắt đầu cuộc trò chuyện mới!</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => onConversationSelect(conversation)}
                className={`w-full p-3 rounded-lg mb-2 text-left transition-all duration-200 group hover:bg-gray-800 ${
                  currentConversationId === conversation.conversationId
                    ? "bg-gray-800 border border-gray-600"
                    : "hover:bg-gray-800/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <MessageSquare className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <h3 className="font-medium text-sm truncate text-white">
                        {getConversationTitle(conversation)}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400 truncate mb-1">
                      {getLastMessage(conversation)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(conversation.updatedAt)}
                    </div>
                  </div>

                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement conversation actions
                      }}
                      className="p-1 rounded hover:bg-gray-700"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </button>
            ))}

            {/* Load More Button */}
            {meta.page < meta.totalPages && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full p-3 text-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang tải...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Tải thêm ({meta.total - conversations.length} còn lại)
                  </div>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          {conversations.length > 0 && (
            <p>
              Hiển thị {conversations.length} / {meta.total} cuộc trò chuyện
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
