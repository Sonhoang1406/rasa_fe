import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Mic,
  Plus,
  SendHorizonal,
  Sparkles,
  Lightbulb,
  Code,
  Palette,
} from "lucide-react";

export function HomeChatDemo() {
  const quickSuggestions = [
    {
      icon: Lightbulb,
      text: "Giải thích về AI",
      color: "from-blue-200 to-blue-300",
    },
    {
      icon: Code,
      text: "Viết code React",
      color: "from-indigo-200 to-indigo-300",
    },
    {
      icon: Palette,
      text: "Ý tưởng sáng tạo",
      color: "from-purple-200 to-purple-300",
    },
    {
      icon: MessageSquare,
      text: "Tóm tắt văn bản",
      color: "from-teal-200 to-teal-300",
    },
  ];

  return (
    <div
      className="relative flex flex-col min-h-screen text-foreground"
      style={{
        background: "linear-gradient(180deg, #f0f9ff 0%, #fefefe 100%)",
      }}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-3 md:p-4 max-h-screen overflow-hidden">
        <div className="max-w-4xl w-full flex flex-col gap-3 h-full justify-center py-2">
          {/* Header Section with Icon */}
          <div
            className="text-center space-y-2"
            style={{
              animation: "fadeInUp 0.6s ease-out",
            }}
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-1 relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)",
              }}
            >
              <Sparkles className="h-8 w-8 text-blue-500" />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  background: "rgba(59, 130, 246, 0.1)",
                }}
              />
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-700 mb-1"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              Tôi có thể giúp gì cho bạn?
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Trợ lý AI thông minh giúp bạn viết, phân tích và sáng tạo
            </p>
          </div>

          {/* Chat Container with Glassmorphism */}
          <div
            className="rounded-2xl p-4 h-[200px] md:h-[240px] overflow-y-auto relative flex-shrink-0"
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(59, 130, 246, 0.1)",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.08)",
              animation: "fadeIn 0.8s ease-out 0.2s backwards",
            }}
          >
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3 relative"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))",
                  backdropFilter: "blur(10px)",
                }}
              >
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-lg font-semibold mb-2 text-gray-700">
                Bắt đầu cuộc trò chuyện
              </p>
              <p className="text-xs md:text-sm max-w-md text-gray-500">
                Chọn gợi ý bên dưới hoặc nhập câu hỏi của bạn để bắt đầu
              </p>
            </div>
          </div>

          {/* Quick Suggestions Grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-shrink-0"
            style={{
              animation: "fadeIn 1s ease-out 0.4s backwards",
            }}
          >
            {quickSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  className="group relative p-3 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(59, 130, 246, 0.15)",
                    boxShadow: "0 2px 10px rgba(59, 130, 246, 0.08)",
                    animation: `fadeInUp 0.6s ease-out ${
                      0.1 * index
                    }s backwards`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.95)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(59, 130, 246, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.8)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 10px rgba(59, 130, 246, 0.08)";
                  }}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center`}
                      style={{
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                      {suggestion.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Input Area with Glass Effect */}
          <div
            className="w-full space-y-2 flex-shrink-0"
            style={{
              animation: "fadeInUp 0.8s ease-out 0.6s backwards",
            }}
          >
            <div className="relative group">
              {/* Glow Effect on Focus */}
              <div
                className="absolute -inset-1 rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15))",
                  filter: "blur(10px)",
                }}
              />

              <div
                className="relative rounded-2xl transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)",
                }}
              >
                <Input
                  placeholder="Hỏi bất kỳ điều gì..."
                  className="min-h-[56px] pl-14 pr-28 py-4 rounded-2xl border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm bg-transparent text-gray-700 placeholder:text-gray-400"
                />

                {/* Left Button */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <button
                    className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59, 130, 246, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59, 130, 246, 0.1)";
                    }}
                  >
                    <Plus className="h-5 w-5 text-blue-600" />
                  </button>
                </div>

                {/* Right Buttons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                  <button
                    className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59, 130, 246, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59, 130, 246, 0.1)";
                    }}
                  >
                    <Mic className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background:
                        "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)",
                      boxShadow: "0 2px 10px rgba(59, 130, 246, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(59, 130, 246, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 10px rgba(59, 130, 246, 0.3)";
                    }}
                  >
                    <SendHorizonal className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-500">
              Chat Bot có thể mắc lỗi. Hãy kiểm tra các thông tin quan trọng.
            </p>
          </div>
        </div>
      </main>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
