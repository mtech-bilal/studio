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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, CalendarDays, Stethoscope, Users2, CreditCard, Settings, User, LogOut, HeartPulse,
  Users, ShieldCheck, PlusCircle, ChevronDown, ChevronRight, List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import React from "react"; // Import React for useState

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({
    doctors: false,
    users: false,
    roles: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Update isActive to handle group and sub-item active states
  const isActive = (path: string, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };
  
  React.useEffect(() => {
    // Automatically open parent menu if a sub-item is active
    const newOpenMenus = { ...openMenus };
    if (isActive("/admin/physicians")) newOpenMenus.doctors = true;
    if (isActive("/admin/users")) newOpenMenus.users = true;
    if (isActive("/admin/roles")) newOpenMenus.roles = true;
    // Add other menu groups here if needed
    setOpenMenus(newOpenMenus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';
  const canAccessDashboard = isAuthenticated;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 justify-between p-2 h-16 border-b border-sidebar-border">
           <Link href="/admin/dashboard" className="flex items-center gap-2.5 font-semibold text-xl text-primary">
             <HeartPulse className="h-7 w-7" />
             <span className="group-data-[collapsible=icon]:hidden">Doctris</span>
           </Link>
           <div className="group-data-[collapsible=icon]:hidden">
             <SidebarTrigger />
           </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarMenu>
          {canAccessDashboard && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/dashboard", true)} tooltip="Dashboard">
                <Link href="/admin/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {isAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/create-link")} tooltip="Appointments">
                  <Link href="/admin/create-link"><CalendarDays /><span>Appointments</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Doctors Group */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => toggleMenu('doctors')} isActive={isActive("/admin/physicians")} tooltip="Doctors">
                  <Stethoscope />
                  <span>Doctors</span>
                  {openMenus.doctors ? <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" /> : <ChevronRight className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />}
                </SidebarMenuButton>
                {openMenus.doctors && (
                  <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                    <li><SidebarMenuSubButton asChild isActive={isActive("/admin/physicians", true) && !pathname.includes("/add")}><Link href="/admin/physicians"><List className="h-3.5 w-3.5"/>Doctors List</Link></SidebarMenuSubButton></li>
                    <li><SidebarMenuSubButton asChild isActive={isActive("/admin/physicians/add")}><Link href="/admin/physicians/add"><PlusCircle className="h-3.5 w-3.5"/>Add Doctor</Link></SidebarMenuSubButton></li>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/customers")} tooltip="Patients">
                  <Link href="/admin/customers"><Users2 /><span>Patients</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/payments")} tooltip="Payments">
                  <Link href="/admin/payments"><CreditCard /><span>Payments</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
           )}
          
          {isAdmin && (
             <>
              <Separator className="my-3" />
              <p className="px-4 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden mb-1">Admin Tools</p>
              
              {/* Users Group */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => toggleMenu('users')} isActive={isActive("/admin/users")} tooltip="User Management">
                  <Users />
                  <span>Users</span>
                  {openMenus.users ? <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" /> : <ChevronRight className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />}
                </SidebarMenuButton>
                {openMenus.users && (
                  <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                    <li><SidebarMenuSubButton asChild isActive={isActive("/admin/users", true) && !pathname.includes("/add")}><Link href="/admin/users"><List className="h-3.5 w-3.5"/>Users List</Link></SidebarMenuSubButton></li>
                    <li><SidebarMenuSubButton asChild isActive={isActive("/admin/users/add")}><Link href="/admin/users/add"><PlusCircle className="h-3.5 w-3.5"/>Add User</Link></SidebarMenuSubButton></li>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Roles Group */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => toggleMenu('roles')} isActive={isActive("/admin/roles")} tooltip="Role Management">
                  <ShieldCheck />
                  <span>Roles</span>
                  {openMenus.roles ? <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" /> : <ChevronRight className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />}
                </SidebarMenuButton>
                {openMenus.roles && (
                  <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                     <li><SidebarMenuSubButton asChild isActive={isActive("/admin/roles", true) && !pathname.includes("/add")}><Link href="/admin/roles"><List className="h-3.5 w-3.5"/>Roles List</Link></SidebarMenuSubButton></li>
                    <li><SidebarMenuSubButton asChild isActive={isActive("/admin/roles/add")}><Link href="/admin/roles/add"><PlusCircle className="h-3.5 w-3.5"/>Add Role</Link></SidebarMenuSubButton></li>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/settings")} tooltip="Settings">
                  <Link href="/admin/settings"><Settings /><span>Settings</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

           <Separator className="my-3 mt-auto group-data-[collapsible=icon]:hidden" />
          {isAuthenticated && (
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/profile")} tooltip="Profile">
                <Link href="/admin/profile"><User /><span>Profile</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      
      {isAuthenticated && (
         <SidebarFooter className="border-t border-sidebar-border p-2">
           <SidebarMenu>
             <SidebarMenuItem>
               <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                 <LogOut /><span>Logout</span>
               </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
         </SidebarFooter>
      )}
    </Sidebar>
  );
}
