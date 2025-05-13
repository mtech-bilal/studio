// src/app/admin/roles/page.tsx
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Removed Input and Label imports
// Removed Dialog related imports
import { ShieldCheck, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMockRoles, deleteRole, type Role } from '@/actions/roleActions'; // Removed createRole, updateRole, RoleInput

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // General processing state for delete
  const { toast } = useToast();

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const mockRolesList = await fetchMockRoles();
      // Sort roles, perhaps alphabetically by title or name
      mockRolesList.sort((a, b) => a.title.localeCompare(b.title));
      setRoles(mockRolesList);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast({ title: "Error", description: "Could not fetch roles.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);


  const handleDeleteRole = async (id: string) => {
    const roleToDelete = roles.find(r => r._id === id);
    if (roleToDelete && ['admin', 'physician', 'customer'].includes(roleToDelete.name)) {
        toast({ title: "Action Denied", description: `Cannot delete core system role: ${roleToDelete.title}.`, variant: "destructive"});
        return;
    }

    if (!confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
        return;
    }
    setIsProcessing(true);
    try {
         startTransition(async () => {
            await deleteRole(id);
            toast({ title: "Success", description: "Role deleted successfully." });
            await loadRoles(); // Refresh the list
        });
    } catch (error) {
        console.error("Failed to delete role:", error);
        toast({ title: "Error", description: "Could not delete role. It might be in use.", variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  };
  
  if (isLoading && roles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-1/3" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-1/2 mt-1" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-8 w-20" /><Skeleton className="h-8 w-20 ml-2" /></CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Roles Management</h1>
         <Button asChild>
            <Link href="/admin/roles/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Role
            </Link>
         </Button>
       </div>

      <div className="space-y-4">
         {roles.length > 0 ? (
            roles.map((role) => (
              <Card key={role._id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="bg-muted/50 p-4 flex flex-row justify-between items-center">
                   <div>
                     <CardTitle className="text-xl flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary"/> {role.title}
                     </CardTitle>
                     <CardDescription className="pt-1">Internal Name: {role.name}</CardDescription>
                   </div>
                   <div className="flex gap-1">
                      <Button variant="ghost" size="sm" asChild disabled={isProcessing}>
                         <Link href={`/admin/roles/edit/${role._id}`}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                         </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                        onClick={() => handleDeleteRole(role._id)}
                        disabled={isProcessing || ['admin', 'physician', 'customer'].includes(role.name)}
                        title={['admin', 'physician', 'customer'].includes(role.name) ? "Cannot delete core roles" : "Delete role"}
                        >
                         <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                   </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {role.name === 'admin' && 'This role has full system access.'}
                    {(role.name === 'physician' || role.name === 'customer') && 'This role has access to the dashboard and profile.'}
                    {role.name !== 'admin' && role.name !== 'physician' && role.name !== 'customer' && 'Custom role. Define access rules in application logic.'}
                  </p>
                </CardContent>
              </Card>
            ))
         ) : (
             <Card>
                <CardContent className="text-center text-muted-foreground py-8">
                   {isLoading ? 'Loading roles...' : 'No roles defined yet. Add a role to get started.'}
                </CardContent>
             </Card>
         )}
      </div>
    </div>
  );
}
