// hooks/useOnlineStatus.ts
"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

type UserID = string;

interface OnlineStatusOptions {
  activityDebounceTime?: number;
  heartbeatInterval?: number;
  statusCheckInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
  enableLogging?: boolean;
}

const DEFAULT_OPTIONS: Required<OnlineStatusOptions> = {
  activityDebounceTime: 30_000,
  heartbeatInterval: 60_000,
  statusCheckInterval: 30_000,
  maxRetries: 3,
  retryDelay: 1_000,
  enableLogging: false,
};

const getAuthToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export function useOnlineStatus(
  userId?: UserID,
  options: OnlineStatusOptions = {}
) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const [isOnline, setIsOnline] = useState(false);
  const [isNetworkOnline, setIsNetworkOnline] = useState(true);
  const lastActivity = useRef(Date.now());
  const activityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- API calls ------------------------------------------------------------
  const _updateStatus = async (retry = 0): Promise<{ success: boolean }> => {
    if (!userId) return { success: false };
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 5_000);
      const res = await fetch("/api/profile/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ userId, timestamp: Date.now() }),
        signal: controller.signal,
      });
      clearTimeout(id);
      if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
      return { success: true };
    } catch (err: any) {
      if (retry < config.maxRetries) {
        await new Promise((r) => setTimeout(r, config.retryDelay * 2 ** retry));
        return _updateStatus(retry + 1);
      }
      console.error("[useOnlineStatus] update error:", err);
      return { success: false };
    }
  };

  const _checkStatus = async (): Promise<{ isOnline: boolean }> => {
    if (!userId) return { isOnline: false };
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 5_000);
      const res = await fetch("/api/profile/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ userId }),
        signal: controller.signal,
      });
      clearTimeout(id);
      if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
      return res.json();
    } catch (err) {
      console.error("[useOnlineStatus] status check error:", err);
      return { isOnline: false };
    }
  };

  // --- React-Query hooks ---------------------------------------------------
  const updateMutation: UseMutationResult<{ success: boolean }, unknown, void> =
    useMutation({
      mutationFn: () => _updateStatus(),
    });

  const offlineMutation: UseMutationResult<
    { success: boolean },
    unknown,
    void
  > = useMutation({
    mutationFn: async () => {
      if (!userId) return { success: false };
      // try sendBeacon first
      if (navigator.sendBeacon) {
        const blob = new Blob(
          [JSON.stringify({ userId, timestamp: Date.now() })],
          { type: "application/json" }
        );
        if (navigator.sendBeacon("/api/profile/offline", blob)) {
          return { success: true };
        }
      }
      // fallback
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3_000);
      try {
        const res = await fetch("/api/profile/offline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({ userId, timestamp: Date.now() }),
          keepalive: true,
          signal: controller.signal,
        });
        clearTimeout(id);
        if (!res.ok) throw new Error(`Offline failed: ${res.status}`);
        return { success: true };
      } catch (err) {
        console.error("[useOnlineStatus] offline error:", err);
        return { success: false };
      }
    },
  });

  const statusQuery: UseQueryResult<{ isOnline: boolean }, unknown> = useQuery({
    queryKey: ["userStatus", userId],
    queryFn: _checkStatus,
    enabled: !!userId,
    refetchInterval: config.statusCheckInterval,
    retry: config.maxRetries,
    retryDelay: (attempt) => Math.min(config.retryDelay * 2 ** attempt, 30_000),
  });

  // --- Sync React state ----------------------------------------------------
  useEffect(() => {
    if (statusQuery.data?.isOnline !== undefined) {
      setIsOnline(statusQuery.data.isOnline);
    }
  }, [statusQuery.data]);

  // --- Activity tracking & cleanup -----------------------------------------
  const bumpActivity = () => {
    lastActivity.current = Date.now();
    if (activityTimeout.current) clearTimeout(activityTimeout.current);
    activityTimeout.current = setTimeout(() => {
      updateMutation.mutate();
    }, config.activityDebounceTime);
  };

  useEffect(() => {
    if (!userId) return;

    setIsNetworkOnline(navigator.onLine);
    window.addEventListener("online", () => {
      setIsNetworkOnline(true);
      updateMutation.mutate();
    });
    window.addEventListener("offline", () => setIsNetworkOnline(false));

    const hb = setInterval(() => {
      const since = Date.now() - lastActivity.current;
      if (navigator.onLine && since < config.heartbeatInterval * 2) {
        updateMutation.mutate();
      }
    }, config.heartbeatInterval);

    // Activity
    document.addEventListener("mousedown", bumpActivity, { passive: true });
    document.addEventListener("keydown", bumpActivity, { passive: true });
    document.addEventListener("scroll", bumpActivity, { passive: true });

    window.addEventListener("beforeunload", () => offlineMutation.mutate());

    return () => {
      clearInterval(hb);
      if (activityTimeout.current) clearTimeout(activityTimeout.current);
      document.removeEventListener("mousedown", bumpActivity);
      document.removeEventListener("keydown", bumpActivity);
      document.removeEventListener("scroll", bumpActivity);
      window.removeEventListener("online", () => {});
      window.removeEventListener("offline", () => {});
      window.removeEventListener("beforeunload", () =>
        offlineMutation.mutate()
      );
    };
  }, [userId]);

  return {
    isOnline,
    isNetworkOnline,
    updateStatus: () => updateMutation.mutate(),
    setOffline: () => offlineMutation.mutate(),
  };
}
