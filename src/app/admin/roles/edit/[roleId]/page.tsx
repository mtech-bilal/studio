// src/app/admin/roles/edit/[roleId]/page.tsx
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMockRoles, updateRole, type Role, type RoleInput } from '@/actions/roleActions';

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params.roleId as string;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  const [roleInternalName, setRoleInternalName] = useState('');
  const [roleDisplayTitle, setRoleDisplayTitle] = useState('');

  useEffect(() => {
    if (roleId) {
      const loadRole = async () => {
        setIsLoading(true);
        try {
          const allRoles = await fetchMockRoles();
          const foundRole = allRoles.find(r => r._id === roleId);

          if (foundRole) {
            setRole(foundRole);
            setRoleInternalName(foundRole.name);
            setRoleDisplayTitle(foundRole.title);
          } else {
            toast({ title: "Error", description: "Role not found.", variant: "destructive" });
            router.push('/admin/roles');
          }
        } catch (error) {
          console.error("Failed to fetch role:", error);
          toast({ title: "Error", description: "Could not load role data.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      loadRole();
    }
  }, [roleId, router, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!role) return;
    setIsSaving(true);

    if (!roleDisplayTitle.trim()) {
      toast({ title: "Validation Error", description: "Display title is required.", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    // Internal name (role.name) is not changed during edit
    const roleData: Partial<RoleInput> = {
      title: roleDisplayTitle.trim()
    };

    startTransition(async () => {
      try {
        await updateRole(role._id, roleData);
        toast({ title: "Role Updated", description: `Role "${roleData.title}" has been successfully updated.` });
        router.push('/admin/roles');
      } catch (error) {
        console.error("Failed to update role:", error);
        let errorMessage = "Could not update role. Please try again.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
        setIsSaving(false);
      }
    });
  };

  if (isLoading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-10 w-36" />
            </div>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Skeleton className="h-10 w-28 ml-auto" />
                </CardFooter>
            </Card>
        </div>
    );
  }

  if (!role) {
    return <p>Role not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/roles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
          <CardDescription>Update the display title for the role.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleInternalName">Internal Name</Label>
              <Input
                id="roleInternalName"
                value={roleInternalName}
                disabled // Internal name cannot be changed
              />
              <p className="text-xs text-muted-foreground">
                Internal name cannot be changed after creation.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDisplayTitle">Display Title</Label>
              <Input
                id="roleDisplayTitle"
                placeholder="e.g., Staff Member"
                value={roleDisplayTitle}
                onChange={(e) => setRoleDisplayTitle(e.target.value)}
                required
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Friendly name shown in the UI.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
