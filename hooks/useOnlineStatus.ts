// src/hooks/useOnlineStatus.ts
import { useEffect, useState } from "react";
import { useSocketStore } from "@/store/userOnlineStore";

interface ProfilePayload {
  otherProfile: { lastActive: string /* or Date string */ };
}

export function useOnlineStatus(userId?: string) {
  // 1) subscribe to the zustand slice
  const onlineUsers = useSocketStore((s) => s.onlineUsers);

  // 2) store the fetched lastActivity
  const [lastActivity, setLastActivity] = useState<Date | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // tell the server this user is online
    fetch("/api/profiles/online", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userId),
    }).catch(console.error);

    // fetch the profile for its lastActive timestamp
    fetch(`/api/profiles/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ProfilePayload>;
      })
      .then((data) => {
        // assume `data.otherProfile.lastActive` is an ISO string
        setLastActivity(new Date(data.otherProfile.lastActive));
      })
      .catch(console.error);
  }, [userId]);

  // 3) derive the “isOnline” flag from the latest state
  const isOnline = Boolean(userId && onlineUsers.includes(userId));

  return { isOnline, onlineUsers, lastActivity };
}
