// hooks/useFriends.ts
import { useState, useEffect, useCallback } from "react";

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
  const [friendRequestLoading, setLoading] = useState(false);
  const [friendRequestError, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/friend-requests?userId=${encodeURIComponent(userId)}`
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setIncoming(data.incoming ?? []);
      setOutgoing(data.outgoing ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    incoming,
    outgoing,
    friendRequestLoading,
    friendRequestError,
    refresh: fetchRequests,
  };
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
  if (!requester || !recipient || !accept) return;

  const res = await fetch("/api/friend-requests", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requester, recipient, accept }),
  });
  if (!res.ok) throw new Error(`Response failed: ${res.status}`);
}
