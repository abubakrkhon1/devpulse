"use client";

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { LightbulbIcon } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    itemsSub?: {
      title: string;
      url: string;
      icon?: Icon;
    }[];
  }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem
            className={
              state === "expanded"
                ? `flex items-center gap-2`
                : "flex flex-col items-center justify-center gap-2"
            }
          >
            <SidebarMenuButton
              tooltip="New Project"
              className="flex items-center justify-center text-md cursor-pointer mb-2 bg-primary text-secondary hover:bg-primary/70 hover:text-secondary w-1/2 transition ease-linear"
              onClick={() => router.push("/projects/new-project")}
            >
              <IconCirclePlusFilled />
              {state === "expanded" && <span>New Project</span>}
            </SidebarMenuButton>

            <SidebarMenuButton
              tooltip="Brainstorm idea"
              className="flex items-center justify-center text-md cursor-pointer mb-2 bg-secondary border-primary border-2 text-primary hover:bg-primary/10 w-1/2 transition ease-linear"
              onClick={() => router.push("/projects/brainstorm-idea")}
            >
              <LightbulbIcon />
              {state === "expanded" && <span>Brainstorm</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => router.push(item.url)}
                className={
                  pathname === item.url
                    ? `bg-primary/10 hover:bg-primary/10 transition`
                    : `hover:bg-primary/10 transition`
                }
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>

              {/* Fix: check item.itemsSub, not items.itemsSub */}
              {item.itemsSub && item.itemsSub.length > 0 && (
                <SidebarMenuSub>
                  {item.itemsSub.map((subitem) => (
                    <SidebarMenuSubItem key={subitem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subitem.url}>{subitem.title}</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
