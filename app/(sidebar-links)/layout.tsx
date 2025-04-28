"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { createContext, useEffect, useState } from "react";

export const UserOnlineContext = createContext(false);

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [onlineStatus, setOnlineStatus] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    // Update user as active
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

    // Update user as offline
    const setUserOffline = async () => {
      try {
        await fetch(`/api/profile/offline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
          keepalive: true, // ✅ Important so request doesn't cancel when tab closes
        });
      } catch (error) {
        console.error("Error setting user offline:", error);
      }
    };

    // Check user's current status (optional)
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

    // Initial actions
    updateUserActive();
    checkUserStatus();

    // Regular intervals
    const activeInterval = setInterval(updateUserActive, 60000); // update lastActive every 1 min
    const statusInterval = setInterval(checkUserStatus, 30000); // check status every 30s

    // Update active on activity
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    const handleUserActivity = updateUserActive;
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Set offline when tab closes
    const handleBeforeUnload = () => {
      setUserOffline();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up
    return () => {
      clearInterval(activeInterval);
      clearInterval(statusInterval);

      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });

      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Also set offline immediately when component unmounts
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
