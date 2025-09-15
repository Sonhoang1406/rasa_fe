/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { sendMessageToRasa } from "../lib/api/services/chat-rasa-service";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

export function useChatRasa() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (baseUrl: string, message: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessageToRasa(baseUrl, message);

      const botMessages = response.map((item: any) => ({
        sender: "bot" as const,
        text: item.text,
      }));

      setMessages((prev) => [...prev, ...botMessages]);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError("Có lỗi xảy ra khi gửi tin nhắn.");
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    error,
  };
}
