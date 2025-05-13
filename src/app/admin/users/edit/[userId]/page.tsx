// src/app/admin/users/edit/[userId]/page.tsx
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Save, ArrowLeft, UserCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { fetchUserById, updateUser, type User, type UserInputData } from '@/actions/userActions';
import { fetchRoles, type Role } from '@/actions/roleActions';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);


  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setIsLoadingRoles(true); // Also set this loading state
      try {
        const fetchedRoles = await fetchRoles();
        setRoles(fetchedRoles);
        setIsLoadingRoles(false); // Roles loaded

        if (userId) {
          const foundUser = await fetchUserById(userId); // Uses Sanity action
          if (foundUser) {
            setUser(foundUser);
            setName(foundUser.name);
            setEmail(foundUser.email);
            setSelectedRoleId(foundUser.role?._ref || ''); // Ensure role._ref is accessed
            setStatus(foundUser.status);
            setAvatarPreview(foundUser.avatarUrl || null);
          } else {
            toast({ title: "Error", description: "User not found.", variant: "destructive" });
            router.push('/admin/users');
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({ title: "Error", description: "Could not load user or role data.", variant: "destructive" });
      } finally {
        setIsLoading(false); // Main data loading finished
      }
    };
    loadInitialData();
  }, [userId, router, toast]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    const fileInput = document.getElementById('avatarUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setIsSaving(true);

    if (!name.trim() || !email.trim() || !selectedRoleId) {
      toast({ title: "Validation Error", description: "Name, Email, and Role are required.", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    const userData: Partial<UserInputData> = {
      name,
      email,
      roleId: selectedRoleId,
      status,
      avatarUrl: avatarPreview || undefined, // Using preview URL
    };

    startTransition(async () => {
      try {
        // TODO: Handle avatar file upload to Sanity if avatarFile exists
        await updateUser(user._id, userData);
        toast({ title: "User Updated", description: `${name} has been successfully updated.` });
        router.push('/admin/users');
      } catch (error) {
        console.error("Failed to update user:", error);
         let errorMessage = "Could not update user. Please try again.";
        if (error instanceof Error && error.message.includes("already exists")) {
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
        <div className="flex items-center justify-between"> <Skeleton className="h-9 w-1/3" /> <Skeleton className="h-10 w-36" /> </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6"><Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="flex flex-col items-center space-y-4"><Skeleton className="h-32 w-32 rounded-full" /><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-24" /></CardContent></Card></div>
          <div className="lg:col-span-2"><Card><CardHeader><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-3/4 mt-1" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent><CardFooter><Skeleton className="h-10 w-28 ml-auto" /></CardFooter></Card></div>
        </div>
      </div>
    );
  }

  if (!user) return <p>User not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Avatar</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarPreview || `https://picsum.photos/seed/${user._id}/200`} alt={user.name} data-ai-hint="person user"/>
                  <AvatarFallback className="text-4xl">
                    {name ? name.substring(0, 2).toUpperCase() : <UserCircle className="h-12 w-12" />}
                  </AvatarFallback>
                </Avatar>
                <Input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('avatarUpload')?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </Button>
                  {avatarPreview && ( <Button type="button" variant="destructive" onClick={handleRemoveAvatar}>Remove</Button> )}
                </div>
                 <p className="text-xs text-muted-foreground text-center">
                  Uploading to Sanity is not yet implemented for avatars.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Update details for {user.name}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSaving} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={selectedRoleId} onValueChange={setSelectedRoleId} disabled={isSaving || isLoadingRoles}>
                        <SelectTrigger id="role" aria-label="Select role">
                        <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"} />
                        </SelectTrigger>
                        <SelectContent>
                        {isLoadingRoles ? (<SelectItem value="loading" disabled>Loading...</SelectItem>) :
                            roles.map((role) => (
                            <SelectItem key={role._id} value={role._id}>
                                {role.title}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch id="status" checked={status === "Active"} onCheckedChange={(checked) => setStatus(checked ? "Active" : "Inactive")} disabled={isSaving} />
                            <Label htmlFor="status" className="capitalize">{status}</Label>
                        </div>
                    </div>
                </div>
                 <p className="text-sm text-muted-foreground">Password can be changed via the user's profile page or a password reset flow (not implemented).</p>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-end">
                <Button type="submit" disabled={isSaving || isLoadingRoles}>
                  <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
