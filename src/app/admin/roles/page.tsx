// src/app/admin/roles/page.tsx
"use client"; // Required for state and interactions

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShieldCheck, PlusCircle, Edit, Trash2, CheckSquare, Square } from "lucide-react";

interface Permission {
  id: string;
  label: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
}

const allPermissions: Permission[] = [
    { id: "manage_users", label: "Manage Users" },
    { id: "manage_physicians", label: "Manage Physicians" },
    { id: "manage_bookings", label: "Manage Bookings" },
    { id: "manage_settings", label: "Manage Settings" },
    { id: "view_reports", label: "View Reports" },
    { id: "view_schedule", label: "View Schedule" },
    { id: "manage_own_bookings", label: "Manage Own Bookings" },
    { id: "manage_roles", label: "Manage Roles" },
    { id: "manage_payments", label: "Manage Payments" },
];

const initialRoles: Role[] = [
  { id: "admin", name: "Admin", description: "Full access to all system features.", permissions: allPermissions.map(p => p.id) }, // Admin has all permissions
  { id: "staff", name: "Staff", description: "Access to booking management and basic reporting.", permissions: ["manage_bookings", "view_reports", "manage_payments", "view_schedule"] },
  { id: "physician", name: "Physician", description: "Access to own schedule and patient info.", permissions: ["view_schedule", "manage_own_bookings"] },
];


export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Form state
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  const handleOpenDialog = (role: Role | null = null) => {
    setEditingRole(role);
    if (role) {
      setRoleName(role.name);
      setRoleDescription(role.description);
      setSelectedPermissions(new Set(role.permissions));
    } else {
      setRoleName('');
      setRoleDescription('');
      setSelectedPermissions(new Set());
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const newPermissions = new Set(prev);
      if (checked) {
        newPermissions.add(permissionId);
      } else {
        newPermissions.delete(permissionId);
      }
      return newPermissions;
    });
  };

  const handleSaveRole = () => {
     if (!roleName.trim()) return; // Basic validation

    if (editingRole) {
      // Update existing role
      setRoles(roles.map(r =>
        r.id === editingRole.id
          ? { ...r, name: roleName, description: roleDescription, permissions: Array.from(selectedPermissions) }
          : r
      ));
    } else {
      // Add new role
      const newRole: Role = {
        id: `role-${roleName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: roleName,
        description: roleDescription,
        permissions: Array.from(selectedPermissions),
      };
      setRoles([...roles, newRole]);
    }
    handleCloseDialog();
  };

  const handleDeleteRole = (id: string) => {
     // Add confirmation dialog in real app
     setRoles(roles.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
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
                    Define the role name, description, and assign permissions.
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                  <div className="space-y-2">
                     <Label htmlFor="roleName">Role Name</Label>
                     <Input id="roleName" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g., Receptionist" />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="roleDescription">Description</Label>
                     <Input id="roleDescription" value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} placeholder="Brief description of the role" />
                  </div>
                  <div className="space-y-3 pt-2">
                    <Label className="text-base font-medium">Permissions</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {allPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={selectedPermissions.has(permission.id)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                          />
                          <label
                            htmlFor={`perm-${permission.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
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
              <Card key={role.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="bg-muted/50 p-4 flex flex-row justify-between items-center">
                   <div>
                     <CardTitle className="text-xl flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary"/> {role.name}
                     </CardTitle>
                     <CardDescription className="pt-1">{role.description}</CardDescription>
                   </div>
                   <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(role)}>
                         <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteRole(role.id)}>
                         <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                   </div>
                </CardHeader>
                <CardContent className="p-4">
                   <h4 className="font-medium mb-3 text-base">Permissions:</h4>
                   {role.permissions.length > 0 ? (
                     <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                       {role.permissions.map((permissionId) => {
                         const permission = allPermissions.find(p => p.id === permissionId);
                         return permission ? (
                           <li key={permission.id} className="flex items-center space-x-2 text-sm">
                             <CheckSquare className="h-4 w-4 text-accent flex-shrink-0" />
                             <span>{permission.label}</span>
                           </li>
                         ) : null;
                       })}
                     </ul>
                   ) : (
                      <p className="text-sm text-muted-foreground">No permissions assigned.</p>
                   )}

                </CardContent>
              </Card>
            ))
         ) : (
             <Card>
                <CardContent className="text-center text-muted-foreground py-8">
                   No roles defined yet. Add a role to get started.
                </CardContent>
             </Card>
         )}
      </div>
    </div>
  );
}
