// src/components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ClipboardList, Link as LinkIcon, BarChart2, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 justify-between p-2">
           <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-lg">
             <ClipboardList className="h-6 w-6 text-primary" />
             <span className="group-data-[collapsible=icon]:hidden">BookDoc</span>
           </Link>
           <div className="group-data-[collapsible=icon]:hidden">
             <SidebarTrigger />
           </div>
        </div>

      </SidebarHeader>
      <Separator className="my-0 mb-2" />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/admin/dashboard")}
              tooltip="Dashboard"
            >
              <Link href="/admin/dashboard">
                <BarChart2 />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/admin/create-link")}
              tooltip="Create Link"
            >
              <Link href="/admin/create-link">
                <LinkIcon />
                <span>Create Link</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Add more admin links as needed */}
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/admin/settings")}
              tooltip="Settings"
            >
              <Link href="/admin/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <Separator className="my-2" />
       <SidebarFooter>
         <SidebarMenu>
           <SidebarMenuItem>
             <SidebarMenuButton tooltip="Logout">
               <LogOut />
               <span>Logout</span>
             </SidebarMenuButton>
           </SidebarMenuItem>
         </SidebarMenu>
       </SidebarFooter>
    </Sidebar>
  );
}
