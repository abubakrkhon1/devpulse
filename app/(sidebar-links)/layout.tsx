"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useAuthedUser";
import { User } from "@/types/types";
import { useEffect } from "react";
import { useSocketStore } from "@/store/userOnlineStore";

// Create the query client (lazy-initialize to avoid SSR issues)

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const userId = user?._id;
  const socket = useSocket(userId);
  const online = useSocketStore(s => s.onlineUsers);
  return (
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
  );
}
