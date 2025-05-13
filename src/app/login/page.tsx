// src/app/login/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore, type AuthUser } from '@/hooks/useAuth';
// import { client } from '@/sanity/client'; // We will simulate Sanity fetch for now

// Simulated user data that would come from Sanity
const mockSanityUsers: Array<AuthUser & { password?: string }> = [ // Add password for mock check
  { id: 'sanity-admin-001', name: 'Alice Admin', email: 'admin@example.com', role: 'admin', password: 'password', initials: 'AA' },
  { id: 'sanity-physician-001', name: 'Dr. Diana Remedy', email: 'physician@example.com', role: 'physician', password: 'password', initials: 'DR' },
  { id: 'sanity-customer-001', name: 'Charles Client', email: 'customer@example.com', role: 'customer', password: 'password', initials: 'CC' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuthStore();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // --- Mock Authentication & Sanity Fetch Logic ---
    console.log('Attempting login with:', { email, password });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Simulate fetching user from Sanity by email
    // In a real app:
    // const query = `*[_type == "user" && email == $email][0]{
    //   _id, name, email, "role": role->name, "avatarUrl": avatar.asset->url
    // }`;
    // const sanityUser = await client.fetch(query, { email });

    const foundUser = mockSanityUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const authUser: AuthUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role, // Role name from Sanity
        initials: foundUser.initials,
        // avatarUrl: sanityUser.avatarUrl // if you have avatar
      };
      login(authUser); // Update auth store
      toast({
        title: "Login Successful",
        description: `Welcome, ${authUser.name}! Role: ${authUser.role}. Redirecting...`,
      });
      router.push('/admin/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
    // --- End Mock Logic ---
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6 text-primary" /> Admin Portal Login
          </CardTitle>
          <CardDescription>Enter your credentials to access.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
