"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { createContext, useEffect, useRef, useState } from "react";

export const UserOnlineContext = createContext(false);

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [onlineStatus, setOnlineStatus] = useState(false);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    const updateUserActive = async () => {
      try {
        await fetch(`/api/profile/updateStatus`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user._id),
        });
      } catch (error) {
        console.error("Error updating active status:", error);
      }
    };

    const setUserOffline = async () => {
      try {
        await fetch(`/api/profile/offline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
          keepalive: true,
        });
      } catch (error) {
        console.error("Error setting user offline:", error);
      }
    };

    const checkUserStatus = async () => {
      try {
        const response = await fetch(`/api/profile/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        });
        if (response.ok) {
          const data = await response.json();
          setOnlineStatus(data.isOnline);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    // Activity handler (debounced)
    const handleUserActivity = () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      activityTimeoutRef.current = setTimeout(() => {
        updateUserActive();
      }, 30000); // wait 30 seconds after last activity
    };

    updateUserActive();
    checkUserStatus();

    const activeInterval = setInterval(updateUserActive, 60000); // update every 1 minute
    const statusInterval = setInterval(checkUserStatus, 30000); // check every 30s

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    window.addEventListener("beforeunload", setUserOffline);

    return () => {
      clearInterval(activeInterval);
      clearInterval(statusInterval);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);

      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });

      window.removeEventListener("beforeunload", setUserOffline);

      setUserOffline();
    };
  }, [user?._id]);

  return (
    <UserOnlineContext.Provider value={onlineStatus}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserOnlineContext.Provider>
  );
}
