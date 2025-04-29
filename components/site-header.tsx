"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname(); // Example: "/projects/brainstorm-idea"
  const parts = pathname.split("/").filter(Boolean); // ["projects", "brainstorm-idea"]

  return (
    <header className="dark:bg-slate-900 py-8 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {parts.map((route, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <h1 className="text-base font-medium">
              {route[0].toUpperCase() + route.slice(1)}
            </h1>
            {index !== parts.length - 1 && <ArrowRight size={20}/>}
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/abubakrkhon1"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              My GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
