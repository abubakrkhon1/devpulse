// hooks/useFriends.ts
import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface FriendRequest {
  _id: string;
  requester: string;
  recipient: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export function useFriendRequests(userId?: string) {
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const fetchRequests = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/friend-requests?userId=${userId}`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setIncoming(data.incoming);
      setOutgoing(data.outgoing);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRequests();

    // connect socket
    const socket = io("http://localhost:3001", { query: { userId } });
    // whenever a friend‐request event comes in, re‐fetch
    socket.on("friend-request-created", fetchRequests);
    socket.on("friend-request-updated", fetchRequests);
    socket.on("friend-request-cancelled", fetchRequests);

    return () => {
      socket.disconnect();
    };
  }, [fetchRequests, userId]);

  return { incoming, outgoing, loading, error, refresh: fetchRequests };
}

// plain functions for mutations
export async function sendFriendRequest(
  requester?: string,
  recipient?: string
) {
  if (!requester || !recipient) return;
  const res = await fetch("/api/friend-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requester, recipient }),
  });
  if (!res.ok) throw new Error(`Send failed: ${res.status}`);
}

export async function cancelFriendRequest(
  requester?: string,
  recipient?: string
) {
  if (!requester || !recipient) return;

  const res = await fetch("/api/friend-requests", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requester, recipient }),
  });
  if (!res.ok) throw new Error(`Cancel failed: ${res.status}`);
}

export async function respondFriendRequest(
  requester?: string,
  recipient?: string,
  accept?: boolean
) {
  console.log(requester, recipient, accept);
  if (!requester || !recipient) return;
  console.log("requester:", requester, " recipient:", recipient, accept);

  const res = await fetch("/api/friend-requests", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requester, recipient, accept }),
  });
  if (!res.ok) throw new Error(`Response failed: ${res.status}`);
}

export async function removeFriend(userId?: string, friendId?: string) {
  if (!userId || !friendId) return;

  const res = await fetch("/api/friend-requests/remove", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });

  if (!res.ok) throw new Error(`Remove failed: ${res.status}`);
}
