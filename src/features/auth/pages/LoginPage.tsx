
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { authService } from "../api/service";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await authService.login({ email, password });
      // TODO: setAuth ở store sau khi login thành công
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-[400px] shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Đăng nhập vào Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Nút tiếp tục với dịch vụ */}
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full justify-center">
              Tiếp tục với Google
            </Button>
            <Button variant="outline" className="w-full justify-center">
              Tiếp tục với Apple
            </Button>
            <Button variant="outline" className="w-full justify-center">
              Tiếp tục với Microsoft
            </Button>
            <Button variant="outline" className="w-full justify-center">
              Tiếp tục với điện thoại
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-sm text-gray-500">hoặc</span>
            <Separator className="flex-1" />
          </div>

          {/* Form email / password */}
          <div className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="Địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" onClick={handleLogin}>
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
      </Card>
    </div>
  );
};
