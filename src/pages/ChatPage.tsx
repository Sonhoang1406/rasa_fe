import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Đây là phản hồi mẫu của chatbot." },
      ]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      {/* nút profile */}
      <button
        onClick={() => navigate("/profile")}
        className="absolute top-4 right-4 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center 
                   hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
      >
        <span className="text-white font-bold">T</span>
      </button>

      {/* nội dung chính */}
      <div className="flex flex-col flex-1 items-center justify-center">
        <div className="flex flex-col w-full max-w-[798px] h-[600px] bg-white shadow-lg rounded-xl">
          {/* khung tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto shadow-inner">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <div className="text-center">
                    <img src="/logo.png" alt="Logo KMA" className="mx-auto w-24 h-auto" />
                  </div>
                  <div className="text-xl font-bold">Bắt đầu cuộc nói chuyện</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[70%] text-sm ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ô nhập */}
          <div className="p-4 border-t flex gap-2 shadow-md">
            <Input
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Gửi</Button>
          </div>
        </div>
      </div>

      {/* footer dính dưới */}
      <Footer />
    </div>
  );
};
