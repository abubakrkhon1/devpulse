"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserOnlineContext } from "@/hooks/useUserOnlineContext";

// Create the query client (lazy-initialize to avoid SSR issues)
function getQueryClient() {
  // Use module-level variable so it's only created once in browser
  if (typeof window === "undefined") {
    // Return dummy during SSR
    return new QueryClient({
      defaultOptions: {
        queries: { enabled: false },
      },
    });
  }

  // Lazy initialize the client
  if (!(getQueryClient as any).client) {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60000, // 1 minute
          retry: 3,
        },
      },
    });
    (getQueryClient as any).client = client;
  }

  return (getQueryClient as any).client;
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create query client state for client-side hydration
  const [queryClient] = useState(getQueryClient);
  const { user } = useUser();

  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout user={user}>{children}</AppLayout>
    </QueryClientProvider>
  );
}

// Define interface for user type
interface User {
  _id?: string;
  [key: string]: any; // For any other properties
}

// Separate the actual layout to make testing easier
function AppLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  // Use the custom hook to manage online status (it's now safe for SSR)
  const onlineStatus = useOnlineStatus(user?._id, {
    // Custom configuration if needed
    activityDebounceTime: 30000,
    heartbeatInterval: 60000,
  });

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
