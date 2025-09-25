import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { ChatPage } from "./ChatPage";

export const HomeDirectorPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-sky-100">
        <div className="absolute inset-0 pointer-events-none blur-sm">
          {/* Chat UI giả lập */}
          <ChatPage/>
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
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                onClick={() => navigate("/auth")}
              >
                Đăng nhập
              </button>
              <button
                className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
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
