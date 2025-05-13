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
  LayoutDashboard, // Dashboard
  CalendarDays,   // Appointment
  Stethoscope,    // Doctors (Physicians)
  Users2,         // Patients (Customers)
  Pill,           // Pharmacy
  FileText,       // Blogs
  AppWindow,      // Pages (general)
  Mail,           // Email Template
  ShieldAlert,    // Authentication
  Component,      // UI Components
  ListOrdered,    // Miscellaneous (or Layers3)
  Users,          // User Management
  ShieldCheck,    // Roles
  CreditCard,     // Payments
  Settings,       // Settings
  User,           // Profile
  LogOut,         // Logout
  HeartPulse,     // Doctris Logo
  Link2,          // Create Link
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => pathname === path || (path !== '/admin/dashboard' && pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';
  // const isPhysician = user?.role === 'physician'; // For future use
  // const isCustomer = user?.role === 'customer'; // For future use

  // All authenticated users can see Dashboard and Profile
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
      {/* Removed Separator, header has border-b */}
      <SidebarContent className="pt-4">
        <SidebarMenu>
          {/* Dashboard - accessible by all */}
          {canAccessDashboard && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/admin/dashboard")}
                tooltip="Dashboard"
              >
                <Link href="/admin/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {/* Standard User Links (visible to admin, and potentially others if logic expanded) */}
           {isAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/create-link")} // Keep this as 'Appointments' or 'Manage Links'
                  tooltip="Appointments"
                >
                  <Link href="/admin/create-link">
                    <CalendarDays /> 
                    <span>Appointments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/physicians")}
                  tooltip="Doctors"
                >
                  <Link href="/admin/physicians">
                    <Stethoscope />
                    <span>Doctors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/customers")}
                  tooltip="Patients"
                >
                  <Link href="/admin/customers">
                    <Users2 />
                    <span>Patients</span>
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
            </>
           )}

          {/* Placeholder links from Doctris theme - for admin */}
          {isAdmin && (
            <>
              {/* Example Placeholder: <SidebarMenuItem><SidebarMenuButton tooltip="Pharmacy"><Pill /><span>Pharmacy</span></SidebarMenuButton></SidebarMenuItem> */}
              {/* Example Placeholder: <SidebarMenuItem><SidebarMenuButton tooltip="Blogs"><FileText /><span>Blogs</span></SidebarMenuButton></SidebarMenuItem> */}
            </>
          )}
          
          {/* Admin specific management links */}
          {isAdmin && (
             <>
              <Separator className="my-3" />
              <p className="px-4 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden mb-1">Admin Tools</p>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/users")}
                  tooltip="User Management"
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
                  tooltip="Role Management"
                >
                  <Link href="/admin/roles">
                    <ShieldCheck />
                    <span>Roles</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
            </>
          )}

          {/* Profile - accessible by all authenticated users */}
           <Separator className="my-3 mt-auto group-data-[collapsible=icon]:hidden" />
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

        </SidebarMenu>
      </SidebarContent>
      
      {isAuthenticated && (
         <SidebarFooter className="border-t border-sidebar-border p-2">
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
