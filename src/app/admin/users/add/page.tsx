// src/app/admin/users/add/page.tsx
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, ArrowLeft, UserPlus as UserPlusIcon } from "lucide-react"; // Renamed UserPlus
import { useToast } from '@/hooks/use-toast';
import { createMockUser, type UserInputData } from '@/actions/userActions';
import { fetchMockRoles, type Role } from '@/actions/roleActions';

export default function AddUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const fetchedRoles = await fetchMockRoles();
        setRoles(fetchedRoles);
        if (fetchedRoles.length > 0) {
          // Set a default role if desired, e.g., the first one or 'customer'
          const defaultRole = fetchedRoles.find(r => r.name === 'customer') || fetchedRoles[0];
          if (defaultRole) setSelectedRole(defaultRole.name);
        }
      } catch (error) {
        toast({ title: "Error", description: "Could not load roles.", variant: "destructive" });
      } finally {
        setIsLoadingRoles(false);
      }
    };
    loadRoles();
  }, [toast]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => setAvatarPreview(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    if (!name.trim() || !email.trim() || !password || !selectedRole) {
      toast({ title: "Validation Error", description: "Name, Email, Password, and Role are required.", variant: "destructive" });
      setIsSaving(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Validation Error", description: "Passwords do not match.", variant: "destructive" });
      setIsSaving(false);
      return;
    }
    if (password.length < 6) {
        toast({ title: "Validation Error", description: "Password must be at least 6 characters.", variant: "destructive" });
        setIsSaving(false);
        return;
    }

    const userData: UserInputData = {
      name,
      email,
      password,
      role: selectedRole,
      status: "Active", // Default status
      avatarUrl: avatarPreview || undefined, // Pass undefined if no avatar
    };

    startTransition(async () => {
      try {
        await createMockUser(userData);
        toast({ title: "User Added", description: `${name} has been successfully added.` });
        router.push('/admin/users');
      } catch (error) {
        console.error("Failed to add user:", error);
        let errorMessage = "Could not add user. Please try again.";
        if (error instanceof Error && error.message.includes("already exists")) {
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
        <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Avatar</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarPreview || undefined} alt="Avatar Preview" data-ai-hint="person user" />
                  <AvatarFallback className="text-4xl">
                    {name ? name.substring(0, 2).toUpperCase() : <UserPlusIcon className="h-12 w-12" />}
                  </AvatarFallback>
                </Avatar>
                <Input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('avatarUpload')?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </Button>
                  {avatarPreview && (
                    <Button type="button" variant="destructive" onClick={handleRemoveAvatar}>
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Optional. Use a square image for best results.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: User Details Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Enter the details for the new user account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSaving} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSaving} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isSaving} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Assign Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole} disabled={isSaving || isLoadingRoles}>
                    <SelectTrigger id="role" aria-label="Select role">
                      <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingRoles ? (
                        <SelectItem value="loading" disabled>Loading roles...</SelectItem>
                      ) : roles.length > 0 ? (
                        roles.map((role) => (
                          <SelectItem key={role._id} value={role.name}>
                            {role.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-roles" disabled>No roles available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-end">
                <Button type="submit" disabled={isSaving || isLoadingRoles}>
                  <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Creating User...' : 'Create User'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
