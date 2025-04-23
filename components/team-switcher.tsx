"use client";

import { Layers } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function Logo() {
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className=""
          onClick={() => router.push("/dashboard")}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Layers className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-md leading-tight">
            <span className="truncate font-semibold">Pulse</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
