import { Footer } from "@/components/Footer";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-[600px] bg-white rounded-3xl border border-gray-200 p-6">
          {/* Header */}
          <h2 className="text-2xl font-bold text-center mb-6">
            Hồ sơ người dùng
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => setActiveTab("account")}
              className={`pb-2 text-sm font-medium ${
                activeTab === "account"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Cài đặt tài khoản
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`pb-2 text-sm font-medium ${
                activeTab === "security"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Cài đặt bảo mật
            </button>
          </div>

          <Separator />

          {/* Nội dung từng tab */}
          <Card className="mt-6 shadow-none border-0">
            <CardContent className="flex flex-col gap-4 p-0">
              {activeTab === "account" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Họ tên
                    </label>
                    <Input type="text" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input type="email" placeholder="you@example.com" />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    Lưu thay đổi
                  </Button>
                </div>
              )}

              {activeTab === "security" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Mật khẩu hiện tại
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Mật khẩu mới
                    </label>
                    <Input type="password" placeholder="Mật khẩu mới" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Nhập lại mật khẩu mới
                    </label>
                    <Input type="password" placeholder="Nhập lại mật khẩu mới" />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    Đổi mật khẩu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

