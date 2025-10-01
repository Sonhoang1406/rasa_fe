import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { authService } from "../api/service";
import { Footer } from "@/components/Footer";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await authService.login({ email, password });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nội dung chính */}
      <div className="flex flex-1 items-center justify-center bg-gray-20">
        <div className="w-[400px] rounded-3xl border border-gray-200 bg-white flex flex-col">
          <div className="p-6">
            <CardTitle className="text-center text-2xl font-bold mb-2">
              Đăng nhập Chatbot
            </CardTitle>
            <p className="text-center text-sm text-gray-500 mb-4">
              Đăng nhập bằng tài khoản google hoặc email của bạn
            </p>
            <div className="text-center">
              <img src="/logo.png" alt="Logo" className="mx-auto w-24 h-auto" />
            </div>

            <CardContent className="flex flex-col gap-4 p-0 mt-4">
              {/* Nút tiếp tục với dịch vụ */}
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-center">
                  Tiếp tục với Google
                </Button>
              </div>

              <div className="flex items-center gap-2 my-2">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-400">hoặc</span>
                <Separator className="flex-1" />
              </div>

              {/* Form email / password */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-sm font-medium text-gray-800">
                    Email or Username
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <label className="text-sm font-medium text-gray-800">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                  onClick={handleLogin}
                >
                  Đăng nhập
                </Button>
              </div>

              {/* Link sang đăng ký */}
              <p className="text-sm text-center text-gray-500">
                Chưa có tài khoản?{" "}
                <a href="/auth/register" className="underline">
                  Đăng ký
                </a>
              </p>
            </CardContent>
          </div>

          {/* Footer dính liền với khung login */}
        </div>
      </div>
      <Footer />
    </div>
  );
};
