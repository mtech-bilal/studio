// src/app/admin/physicians/add/page.tsx
"use client";

import React, { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save, ArrowLeft, UserPlus } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { createPhysician, type PhysicianInputData } from '@/actions/physicianActions';

export default function AddPhysicianPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [ratePhysical, setRatePhysical] = useState<string>('');
  const [rateOnline, setRateOnline] = useState<string>('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);


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
    setIsSaving(true);

    const physicalRateNum = ratePhysical ? parseFloat(ratePhysical) : null;
    const onlineRateNum = rateOnline ? parseFloat(rateOnline) : null;

    if (!name.trim() || !specialty.trim()) {
      toast({ title: "Validation Error", description: "Full Name and Specialty are required.", variant: "destructive" });
      setIsSaving(false);
      return;
    }
    if (ratePhysical && isNaN(physicalRateNum!)) { // Add null check for physicalRateNum
        toast({ title: "Validation Error", description: "Physical Rate must be a valid number.", variant: "destructive" });
        setIsSaving(false);
        return;
    }
    if (rateOnline && isNaN(onlineRateNum!)) { // Add null check for onlineRateNum
        toast({ title: "Validation Error", description: "Online Rate must be a valid number.", variant: "destructive" });
        setIsSaving(false);
        return;
    }

    const physicianData: PhysicianInputData = {
      name,
      specialty,
      email: email || undefined,
      phone: phone || undefined,
      bio: bio || undefined,
      ratePhysical: physicalRateNum,
      rateOnline: onlineRateNum,
      avatarUrl: avatarPreview || undefined, // Using preview URL for now
    };

    startTransition(async () => {
      try {
        // TODO: If avatarFile exists, handle upload to Sanity and get asset URL
        await createPhysician(physicianData);
        toast({ title: "Physician Added", description: `${name} has been successfully added.` });
        router.push('/admin/physicians');
      } catch (error) {
        console.error("Failed to add physician:", error);
        toast({ title: "Error", description: "Could not add physician. Please try again.", variant: "destructive" });
        setIsSaving(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Physician</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/physicians">
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
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarPreview || undefined} alt="Avatar Preview" data-ai-hint="person doctor" />
                  <AvatarFallback className="text-4xl">
                    {name ? name.substring(0, 2).toUpperCase() : <UserPlus className="h-12 w-12" />}
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
                  Optional. Uploading to Sanity not yet implemented. Provide URL or leave blank.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Physician Details</CardTitle>
                <CardDescription>Fill in the information for the new physician.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Dr. John Doe" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty / Department</Label>
                    <Input id="specialty" placeholder="Cardiology" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required disabled={isSaving} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input id="email" type="email" placeholder="physician@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSaving} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" placeholder="+1 234 567 8900" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSaving} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ratePhysical">Physical Rate ($)</Label>
                    <Input id="ratePhysical" type="number" placeholder="150" value={ratePhysical} onChange={(e) => setRatePhysical(e.target.value)} disabled={isSaving} step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rateOnline">Online Rate ($)</Label>
                    <Input id="rateOnline" type="number" placeholder="75" value={rateOnline} onChange={(e) => setRateOnline(e.target.value)} disabled={isSaving} step="0.01" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biography (Optional)</Label>
                  <Textarea id="bio" placeholder="A brief introduction about the physician..." value={bio} onChange={(e) => setBio(e.target.value)} rows={4} disabled={isSaving} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
                    <Input id="avatarUrl" placeholder="https://example.com/avatar.jpg" value={avatarPreview || ''} onChange={(e) => setAvatarPreview(e.target.value)} disabled={isSaving || !!avatarFile} />
                     <p className="text-xs text-muted-foreground">If uploading, this field will be ignored. Clear upload to use URL.</p>
                 </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Physician'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
