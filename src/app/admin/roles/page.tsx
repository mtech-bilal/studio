// src/app/admin/roles/page.tsx
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShieldCheck, PlusCircle, Edit, Trash2 } from "lucide-react";
import { client } from '@/sanity/client';
import type { SanityDocument } from 'next-sanity';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { createRole, updateRole, deleteRole, type Role } from '@/actions/roleActions'; // Import server actions

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const { toast } = useToast();

  // Form state
  const [roleInternalName, setRoleInternalName] = useState('');
  const [roleDisplayTitle, setRoleDisplayTitle] = useState('');

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const sanityRoles: Role[] = await client.fetch('*[_type == "role"]{_id, _createdAt, _updatedAt, _rev, _type, name, title}');
      setRoles(sanityRoles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast({ title: "Error", description: "Could not fetch roles.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenDialog = (role: Role | null = null) => {
    setEditingRole(role);
    if (role) {
      setRoleInternalName(role.name);
      setRoleDisplayTitle(role.title);
    } else {
      setRoleInternalName('');
      setRoleDisplayTitle('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  const handleSaveRole = async () => {
    if (!roleInternalName.trim() || !roleDisplayTitle.trim()) {
        toast({ title: "Validation Error", description: "Both internal name and display title are required.", variant: "destructive"});
        return;
    }

    const roleData = { name: roleInternalName.toLowerCase(), title: roleDisplayTitle };

    try {
        // For UI feedback, you can set a specific loading state for the dialog if needed
        // setIsLoading(true); 
        if (editingRole) {
         startTransition(async () => {
            await updateRole(editingRole._id, roleData);
            toast({ title: "Success", description: "Role updated successfully." });
            await fetchRoles(); // Refresh list
            handleCloseDialog();
          });
        } else {
          startTransition(async () => {
            await createRole(roleData);
            toast({ title: "Success", description: "Role created successfully." });
            await fetchRoles(); // Refresh list
            handleCloseDialog();
          });
        }
    } catch (error) {
        console.error("Failed to save role:", error);
        toast({ title: "Error", description: "Could not save role.", variant: "destructive" });
    } finally {
        // setIsLoading(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
        return;
    }
    try {
        // setIsLoading(true);
         startTransition(async () => {
            await deleteRole(id);
            toast({ title: "Success", description: "Role deleted successfully." });
            await fetchRoles(); // Refresh list
        });
    } catch (error) {
        console.error("Failed to delete role:", error);
        toast({ title: "Error", description: "Could not delete role. It might be in use.", variant: "destructive" });
    } finally {
        // setIsLoading(false);
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
              <CardFooter><Skeleton className="h-8 w-20" /></CardFooter>
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
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button onClick={() => handleOpenDialog()}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Role
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
               <DialogHeader>
                 <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                 <DialogDescription>
                    Define the role name and display title. Permissions are based on the role name (admin, physician, customer).
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                     <Label htmlFor="roleInternalName">Internal Name (e.g., admin, physician)</Label>
                     <Input id="roleInternalName" value={roleInternalName} onChange={(e) => setRoleInternalName(e.target.value)} placeholder="e.g., staff_member" disabled={!!editingRole} />
                     {editingRole && <p className="text-xs text-muted-foreground">Internal name cannot be changed after creation.</p>}
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="roleDisplayTitle">Display Title (e.g., Administrator)</Label>
                     <Input id="roleDisplayTitle" value={roleDisplayTitle} onChange={(e) => setRoleDisplayTitle(e.target.value)} placeholder="e.g., Staff Member" />
                  </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                 <Button onClick={handleSaveRole}>Save Role</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
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
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(role)}>
                         <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteRole(role._id)}>
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