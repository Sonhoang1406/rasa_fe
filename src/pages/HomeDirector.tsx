import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { ChatPage } from "./ChatPage";

export const HomeDirectorPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <div className="absolute inset-0 pointer-events-none">
          {/* Chat UI giả lập */}
          <div className="flex flex-col h-screen opacity-30">
            {/* Header giả lập */}
            <div className="p-4 border-b bg-white/70 font-semibold">ChatGPT</div>

            {/* Vùng chat giả lập */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3 bg-gray-200 rounded-lg w-1/2">
                Xin chào! Đây là ChatGPT.
              </div>
              <div className="p-3 bg-blue-200 rounded-lg w-1/2 ml-auto">
                Tôi muốn hỏi một vài điều.
              </div>
              <div className="p-3 bg-gray-200 rounded-lg w-2/3">
                Bạn cần đăng nhập để tiếp tục trò chuyện.
              </div>
            </div>

            {/* Input giả lập */}
            <div className="p-4 border-t bg-white/70">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                disabled
              />
            </div>
          </div>

          {/* Lớp overlay Welcome */}
          <div className="absolute inset-0 bg-gray-100/70 backdrop-blur-sm flex items-center justify-center text-center px-4">
            <div>
              {/* Logo ChatGPT giả lập */}
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                G
              </div>

              <h1 className="text-3xl font-bold mb-3">Welcome to ChatGPT</h1>
              <p className="text-gray-600 mb-8">
                Đăng nhập hoặc đăng ký để bắt đầu trò chuyện
              </p>

              <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                <button
                  className="w-full bg-blue-500 text-white py-2 rounded-md"
                  onClick={() => navigate("/auth")}
                >
                  Đăng nhập
                </button>
                <button
                  className="w-full border border-gray-300 py-2 rounded-md bg-white"
                  onClick={() => navigate("/auth/register")}
                >
                  Đăng ký miễn phí
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Hộp đăng nhập/đăng ký nổi lên */}
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl text-center">
            <h1 className="text-2xl font-bold mb-2">Chào mừng trở lại</h1>
            <p className="text-gray-600 mb-6">
              Đăng nhập hoặc đăng ký để tiếp tục sử dụng Chatbot
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-blue-500 text-white py-2 rounded-md"
                onClick={() => navigate("/auth")}
              >
                Đăng nhập
              </button>
              <button
                className="w-full border border-gray-300 py-2 rounded-md"
                onClick={() => navigate("/auth/register")}
              >
                Đăng ký miễn phí
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return <ChatPage />;
};
