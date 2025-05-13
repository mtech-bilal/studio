// src/app/admin/roles/add/page.tsx
"use client";

import React, { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { createRole, type RoleInput, fetchRoles } from '@/actions/roleActions';

export default function AddRolePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [roleInternalName, setRoleInternalName] = useState('');
  const [roleDisplayTitle, setRoleDisplayTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const internalNameClean = roleInternalName.toLowerCase().trim().replace(/\s+/g, '_');

    if (!internalNameClean || !roleDisplayTitle.trim()) {
      toast({ title: "Validation Error", description: "Both internal name and display title are required.", variant: "destructive" });
      setIsSaving(false);
      return;
    }
     if (!/^[a-z0-9_]+$/.test(internalNameClean)) {
      toast({ title: "Validation Error", description: "Internal name must be lowercase letters, numbers, and underscores only.", variant: "destructive" });
      setIsSaving(false);
      return;
    }


    const roleData: RoleInput = {
      name: internalNameClean,
      title: roleDisplayTitle.trim(),
      description: roleDescription.trim()
    };

    startTransition(async () => {
      try {
        const existingRoles = await fetchRoles();
        if (existingRoles.some(r => r.name.current === roleData.name)) {
            toast({ title: "Error", description: `Role with internal name "${roleData.name}" already exists.`, variant: "destructive" });
            setIsSaving(false);
            return;
        }

        await createRole(roleData);
        toast({ title: "Role Added", description: `Role "${roleData.title}" has been successfully added.` });
        router.push('/admin/roles');
      } catch (error) {
        console.error("Failed to add role:", error);
        let errorMessage = "Could not add role. Please try again.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
        setIsSaving(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Role</h1>
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
          <CardDescription>Define a new user role for the system.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleInternalName">Internal Name</Label>
              <Input
                id="roleInternalName"
                placeholder="e.g., staff_member"
                value={roleInternalName}
                onChange={(e) => setRoleInternalName(e.target.value)}
                required
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Used internally. Lowercase letters, numbers, and underscores only. Cannot be changed later.
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
             <div className="space-y-2">
              <Label htmlFor="roleDescription">Description (Optional)</Label>
              <Textarea
                id="roleDescription"
                placeholder="A brief description of what this role can do."
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                rows={3}
                disabled={isSaving}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Role'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
