import { useSocketStore } from "@/store/userOnlineStore";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (userId: string | undefined) => {
  const { setOnlineUsers, addOnlineUser, removeOnlineUser } = useSocketStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:3001", {
      query: { userId },
    });
    setSocket(socket);

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO");
    });

    socket.on("users-online", (data) => {
      console.log("🟢 Users online:", data);
      const list = data || [];
      console.log("🟢 all users:", list);
      setOnlineUsers(list);
      if (data.includes(userId)) {
        console.log(`🟢 ${userId} set to online`);
      }
    });

    socket.on("user-offline", (data: { userId: string }) => {
      console.log("🔴 went offline:", data.userId);
      removeOnlineUser(data.userId);
    });

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, [userId]);
};
