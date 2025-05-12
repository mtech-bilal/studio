// src/app/admin/profile/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, User as UserIcon, Mail, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock user data - replace with actual user session/data fetching
const currentUser = {
  id: "user1",
  name: "Alice Admin",
  email: "alice@example.com",
  role: "Admin",
  avatarUrl: "https://picsum.photos/100/100", // Placeholder image
  initials: "AA",
};

export default function ProfilePage() {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset fields if cancelling edit
    if (isEditing) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    console.log("Saving changes:", { name, email });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
    // Update mock current user (in real app, you'd refetch or update state)
    currentUser.name = name;
    currentUser.email = email;
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
         <Button onClick={handleEditToggle} variant={isEditing ? "outline" : "default"}>
            {isEditing ? "Cancel Edit" : "Edit Profile"}
         </Button>
      </div>


      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center space-x-4">
             <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="person portrait" />
                <AvatarFallback>{currentUser.initials}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
                <CardTitle className="text-2xl">{isEditing ? 'Editing Profile' : currentUser.name}</CardTitle>
                <CardDescription>Manage your personal information and account settings.</CardDescription>
             </div>
              {isEditing && (
                 <Button size="sm" variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Upload Photo
                 </Button>
              )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Name Field */}
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
                  <p className="text-lg font-medium p-2">{name}</p>
                )}
             </div>

             {/* Email Field */}
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
                  <p className="text-lg font-medium p-2">{email}</p>
                )}
             </div>
          </div>

          {/* Role Field (Read-only) */}
          <div className="space-y-1">
             <Label className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-muted-foreground" />Role</Label>
             <Badge variant="secondary" className="text-base px-3 py-1">{currentUser.role}</Badge>
          </div>

          {/* Placeholder for other settings */}
          {isEditing && (
             <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Security Settings</h3>
                <Button variant="outline">Change Password</Button>
             </div>
          )}

        </CardContent>
        {isEditing && (
           <CardFooter className="border-t pt-4">
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                 {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
           </CardFooter>
        )}
      </Card>
    </div>
  );
}
