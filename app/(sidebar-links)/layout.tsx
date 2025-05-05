"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useTokenUser } from "@/hooks/useTokenUser";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Create the query client (lazy-initialize to avoid SSR issues)

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, error } = useTokenUser();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

  if (loading) return <div className="w-full h-screen flex items-center justify-center animate-pulse">Loading...</div>;
  if (!user) return null;

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
