// src/app/admin/layout.tsx
"use client"; // This layout needs to be a client component to use hooks

import React, { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Specific role-based access control for pages within /admin
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const isAdmin = user.role === 'admin';
      // Only admin can access certain paths
      const adminOnlyPaths = [
        "/admin/users",
        "/admin/roles",
        "/admin/settings",
        "/admin/payments", // Assuming customers are managed by admin
        "/admin/customers", // Assuming customers are managed by admin
        "/admin/physicians", // Assuming physicians are managed by admin
        "/admin/create-link", // Assuming creating links is admin task
      ];

      if (!isAdmin && adminOnlyPaths.some(p => pathname.startsWith(p))) {
        // If not admin and trying to access admin-only path, redirect to dashboard
        // or a more appropriate "access denied" page.
        router.replace("/admin/dashboard"); 
        // Optionally, show a toast message here via a global toast context if available
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);


  if (isLoading) {
    // Show a loading state for the entire admin section
    return (
      <div className="flex min-h-screen">
        <div className="w-64 bg-muted p-4 border-r">
          <Skeleton className="h-8 w-3/4 mb-6" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full mb-3" />
          ))}
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-12 w-1/2 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // This will be brief as the useEffect above should redirect.
    // Can also return null or a more specific "Redirecting..." component.
    return <p>Redirecting to login...</p>;
  }


  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
