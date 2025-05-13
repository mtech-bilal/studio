// src/components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import {
  ClipboardList, Link as LinkIcon, BarChart2, LogOut, Settings,
  Users,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Stethoscope,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => pathname === path || (path !== '/admin/dashboard' && pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // If not authenticated or user role is not available yet, render minimal sidebar or nothing.
  // This depends on how you want to handle the loading state or unauthenticated access to admin layout.
  // For now, we assume this component is only rendered if some level of auth check has passed or is loading.

  const isAdmin = user?.role === 'admin';
  const isPhysician = user?.role === 'physician';
  const isCustomer = user?.role === 'customer';

  const canAccessDashboard = isAdmin || isPhysician || isCustomer;

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
          {/* Dashboard - accessible by Admin, Physician, Customer */}
          {canAccessDashboard && (
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
          )}

          {/* Admin-only links */}
          {isAdmin && (
            <>
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

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/physicians")}
                  tooltip="Physicians"
                >
                  <Link href="/admin/physicians">
                    <Stethoscope />
                    <span>Physicians</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/customers")}
                  tooltip="Customers"
                >
                  <Link href="/admin/customers">
                    <Briefcase />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/payments")}
                  tooltip="Payments"
                >
                  <Link href="/admin/payments">
                    <CreditCard />
                    <span>Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Separator className="my-2" />

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/users")}
                  tooltip="Users"
                >
                  <Link href="/admin/users">
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/roles")}
                  tooltip="Roles"
                >
                  <Link href="/admin/roles">
                    <ShieldCheck />
                    <span>Roles</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {/* Profile - accessible by all authenticated users */}
          {isAuthenticated && (
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/admin/profile")}
                tooltip="Profile"
              >
                <Link href="/admin/profile">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}


          {/* Settings - Admin only */}
          {isAdmin && (
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
          )}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="my-2" />
      {isAuthenticated && (
         <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
               <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                 <LogOut />
                 <span>Logout</span>
               </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
         </SidebarFooter>
      )}
    </Sidebar>
  );
}
