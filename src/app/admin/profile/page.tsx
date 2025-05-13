// src/app/admin/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, User as UserIcon, Mail, Shield, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Removed mock updateProfileInSanity function

export default function ProfilePage() {
  const { user, login, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && user) { // Reset fields if cancelling edit
      setName(user.name);
      setEmail(user.email);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    
    // Simulate API call to update profile (client-side mock)
    console.log("Saving changes (mock):", { name, email });
    await new Promise(resolve => setTimeout(resolve, 1500));
    const updatedData = { name, email }; // Mock response

    setIsSaving(false);
    setIsEditing(false);
    
    // Update user in auth store (client-side)
    if (user) { // Ensure user is not null before spreading
        login({ ...user, ...updatedData });
    }


    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  if (authIsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-1/3" />
        <Card className="shadow-md">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
     router.push('/login'); 
     return <p>Redirecting to login...</p>;
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
         <div>
           <Button onClick={handleEditToggle} variant={isEditing ? "outline" : "default"} className="mr-2">
              {isEditing ? "Cancel Edit" : "Edit Profile"}
           </Button>
            <Button onClick={handleLogout} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
         </div>
      </div>

      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center space-x-4">
             <Avatar className="h-16 w-16">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />}
                <AvatarFallback>{user.initials || user.name.substring(0,2).toUpperCase()}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
                <CardTitle className="text-2xl">{isEditing ? 'Editing Profile' : user.name}</CardTitle>
                <CardDescription>Manage your personal information and account settings.</CardDescription>
             </div>
              {isEditing && (
                 <Button size="sm" variant="outline" disabled> {/* TODO: Implement photo upload */}
                    <Upload className="mr-2 h-4 w-4" /> Upload Photo
                 </Button>
              )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <Label htmlFor="name" className="flex items-center gap-1.5"><UserIcon className="h-4 w-4 text-muted-foreground" />Full Name</Label>
                {isEditing ? (
                  <Input
                     id="name"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     disabled={isSaving}
                  />
                ) : (
                  <p className="text-lg font-medium p-2 min-h-[2.5rem] border rounded-md bg-muted/50">{name}</p>
                )}
             </div>

             <div className="space-y-1">
               <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-muted-foreground" />Email Address</Label>
                {isEditing ? (
                  <Input
                     id="email"
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     disabled={isSaving}
                  />
                ) : (
                   <p className="text-lg font-medium p-2 min-h-[2.5rem] border rounded-md bg-muted/50">{email}</p>
                )}
             </div>
          </div>

          <div className="space-y-1">
             <Label className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-muted-foreground" />Role</Label>
             <Badge variant="secondary" className="text-base px-3 py-1 capitalize">{user.role}</Badge>
          </div>

          {isEditing && (
             <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Security Settings</h3>
                <Button variant="outline" disabled>Change Password</Button> {/* Placeholder */}
             </div>
          )}

        </CardContent>
        {isEditing && (
           <CardFooter className="border-t pt-4">
              <Button onClick={handleSaveChanges} disabled={isSaving || (user && name === user.name && email === user.email)}>
                 {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
           </CardFooter>
        )}
      </Card>
    </div>
  );
}
