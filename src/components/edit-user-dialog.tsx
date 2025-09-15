"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { User } from "../components/users";
import defaultAvatar from "@/assets/vietnam-flag.png";

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setAddress(user.address);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    const token = localStorage.getItem("token_key");
    const res = await fetch(`http://localhost:3000/api/users/me/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, phone, address }),
    });

    const result = await res.json();
    if (result.success) {
      onOpenChange(false);
    } else {
      alert(result.message || "Failed to update user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!user) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
          <DialogDescription>Xem chi tiết hồ sơ tài khoản</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row items-start gap-6 mt-4">
          {/* Avatar nằm góc trái */}
          <div className="flex-shrink-0">
            <img
              src={user.avatar || defaultAvatar}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover border shadow"
            />
          </div>

          {/* Thông tin người dùng */}
          <div className="grid gap-4 w-full">
            {/* Họ tên */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Họ tên</Label>
              <Input value={user.name} disabled className="col-span-3" />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <Input value={user.email} disabled className="col-span-3" />
            </div>

            {/* Các trường còn lại */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">SĐT</Label>
              <Input value={user.phone} disabled className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Ngày sinh</Label>
              <Input
                value={new Date(user.dob).toLocaleDateString("vi-VN")}
                disabled
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Giới tính</Label>
              <Input
                value={user.gender === "MALE" ? "Nam" : "Nữ"}
                disabled
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Địa chỉ</Label>
              <Input value={user.address} disabled className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Vai trò</Label>
              <Input value={user.role} disabled className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Trạng thái</Label>
              <Input
                value={user.deleted ? "Đã bị khóa" : "Đang hoạt động"}
                disabled
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Xác thực</Label>
              <Input
                value={user.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                disabled
                className="col-span-3"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
