import { useUserStore } from "@/store/user-store";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Thay bằng URL server của bạn

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const id = useUserStore((state) => state.credentialId);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!id || !user?._id || !user?.role) return;
    const newSocket = io(import.meta.env.VITE_BASE_URL, {
      auth: {
        userId: user?._id,
        roleId: user?.role?._id,

        credentials: id,
      },
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(newSocket);

    // Clean up khi unmount
    return () => {
      newSocket.disconnect();
    };
  }, [id, user?._id, user?.role]);

  return socket;
};
