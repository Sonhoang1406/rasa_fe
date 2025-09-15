"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Device } from "@/lib/types/user-type";
import { User } from "@/components/users.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";

export function ShowDevicesDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { showDevices, logoutDevice } = useUser();

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchDevices = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await showDevices(id);
      if (res?.success && Array.isArray(res.data)) {
        setDevices(res.data);
      } else {
        setDevices([]);
        setError("Dữ liệu trả về không hợp lệ");
      }
    } catch (err) {
      setError(
        `Không thể tải thiết bị: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && user?._id) {
      fetchDevices(user._id);
    }
  }, [open, user]);

  const formatDate = (dateStr: string) =>
    format(new Date(dateStr), "dd/MM/yyyy HH:mm");

  const getStatus = (updatedAt: string | number | Date) => {
    const lastUpdate = new Date(updatedAt).getTime();
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000; // 15 phút trước

    const isOnline = lastUpdate >= fifteenMinutesAgo;

    return (
      <span
        className={`font-medium ${
          isOnline ? "text-green-600" : "text-gray-500"
        }`}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
    );
  };

  const handleDialogChange = (isOpen: boolean) => {
    onOpenChange(isOpen); // Gọi lại prop để đóng dialog
    if (!isOpen) {
      setSelectedUser(null);
      setSelectedCredentials([]);
    }
  };

  // const handleCheckboxChange = (deviceId) => {
  //   if (selectedCredentials.includes(deviceId)) {
  //     setSelectedCredentials(selectedCredentials.filter(id => id !== deviceId));
  //   } else {
  //     setSelectedCredentials([...selectedCredentials, deviceId]);
  //   }
  // };

  const handleLogoutDevice = async () => {
    if (!selectedUser || selectedCredentials.length === 0) {
      toast.error("Select logout devices");
      setError("Vui lòng chọn thiết bị cần đăng xuất.");
      return;
    }

    try {
      setIsLoading(true);
      await logoutDevice(selectedUser, selectedCredentials);
      await fetchDevices(selectedUser);
      setSelectedCredentials([]);
      setSelectedUser(null);

      toast.success("Devices logout successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to logout device: ${errorMessage}`);
      setError("Không thể đăng xuất thiết bị");
      console.error("Failed to logout device:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSelectAll = (e) => {
  //   const isChecked = e.target.checked;
  //   if (isChecked) {
  //     const allDeviceIds = devices.map(device => device._id);
  //     setSelectedCredentials(allDeviceIds);
  //   } else {
  //     setSelectedCredentials([]);
  //   }
  // };

  const toggleSelect = (device: Device) => {
    const { _id, userId } = device;
    if (!selectedUser) {
      setSelectedUser(userId);
    }
    setSelectedCredentials((prev) =>
      prev.includes(_id) ? prev.filter((item) => item !== _id) : [...prev, _id]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-4xl h-[70vh] overflow-y-auto flex flex-col p-4">
        <DialogHeader>
          <DialogTitle>Danh sách thiết bị</DialogTitle>
          <DialogDescription>
            Thông tin các thiết bị đã đăng nhập
          </DialogDescription>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          {devices.length > 0 && (
            <div className="flex justify-end mt-4">
              <Button
                variant="destructive"
                onClick={handleLogoutDevice}
                disabled={selectedCredentials.length === 0}
              >
                Logout thiết bị đã chọn ({selectedCredentials.length})
              </Button>
            </div>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-10 flex-1">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : devices.length > 0 ? (
          <div className="overflow-auto flex-1 mt-4">
            {devices.length > 0 ? (
              <div className="space-y-4">
                {devices.map((device) => (
                  <div
                    key={device._id}
                    className="p-4 border rounded-lg shadow-md"
                  >
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            checked={selectedCredentials.includes(device._id)}
                            onCheckedChange={() => toggleSelect(device)}
                          />
                          <p className="font-medium">Thiết bị</p>
                        </div>
                        <p>
                          <strong>User ID:</strong> {device.userId}
                        </p>
                        <p>
                          <strong>IP:</strong> {device.ip}
                        </p>
                        <p>
                          <strong>Login Date:</strong> {formatDate(device.iat)}
                        </p>
                        <p>
                          <strong>Expiry Date:</strong> {formatDate(device.exp)}
                        </p>
                        <p>
                          <strong>Status:</strong> {getStatus(device.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Không có thiết bị nào được tìm thấy.
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Không có thiết bị nào được tìm thấy.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
