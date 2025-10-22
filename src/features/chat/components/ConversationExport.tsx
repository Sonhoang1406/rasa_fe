import { useState } from "react";
import { Download, FileText, File, Loader2 } from "lucide-react";
import {
  exportToPDF,
  exportToWord,
  ExportMessage,
} from "../../../lib/exportUtils";
import { IChatMessage } from "@/interfaces/chat.interface";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import toast from "react-hot-toast";

interface ConversationExportProps {
  messages: IChatMessage[];
  conversationTitle?: string;
  className?: string;
}

export function ConversationExport({
  messages,
  conversationTitle = "Cuộc trò chuyện",
  className = "",
}: ConversationExportProps) {
  const [loading, setLoading] = useState<"pdf" | "word" | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const userId = useCurrentUserId();

  const convertToExportFormat = (
    chatMessages: IChatMessage[]
  ): ExportMessage[] => {
    return chatMessages.map((msg) => ({
      role: msg.recipient_id === userId ? "user" : "bot",
      text: msg.text,
      timestamp: new Date().toISOString(),
    }));
  };

  const handleExportPDF = async () => {
    if (messages.length === 0) {
      toast.error("Không có tin nhắn nào để xuất");
      return;
    }

    setLoading("pdf");
    try {
      const exportMessages = convertToExportFormat(messages);
      await exportToPDF(exportMessages, conversationTitle);
      toast.success("Đã xuất file PDF thành công!");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Không thể xuất file PDF");
    } finally {
      setLoading(null);
      setShowMenu(false);
    }
  };

  const handleExportWord = async () => {
    if (messages.length === 0) {
      toast.error("Không có tin nhắn nào để xuất");
      return;
    }

    setLoading("word");
    try {
      const exportMessages = convertToExportFormat(messages);
      await exportToWord(exportMessages, conversationTitle);
      toast.success("Đã xuất file Word thành công!");
    } catch (error) {
      console.error("Word export failed:", error);
      toast.error("Không thể xuất file Word");
    } finally {
      setLoading(null);
      setShowMenu(false);
    }
  };

  if (messages.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Export button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        title="Xuất cuộc trò chuyện"
      >
        <Download className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Export menu */}
      {showMenu && (
        <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]">
          <div className="p-2 space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              Xuất cuộc trò chuyện
            </div>

            {/* PDF export */}
            <button
              onClick={handleExportPDF}
              disabled={loading === "pdf"}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "pdf" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 text-red-500" />
              )}
              <span>Xuất PDF</span>
            </button>

            {/* Word export */}
            <button
              onClick={handleExportWord}
              disabled={loading === "word"}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "word" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <File className="h-4 w-4 text-blue-500" />
              )}
              <span>Xuất Word</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
}
