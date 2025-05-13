// src/app/login/page.tsx
"use client";

import React, { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore, type AuthUser } from '@/hooks/useAuth';
import { authenticateUser } from '@/actions/userActions'; // Import server action

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

    startTransition(async () => {
      try {
        const authUser = await authenticateUser(email, password);

        if (authUser) {
          login(authUser);
          toast({
            title: "Login Successful",
            description: `Welcome, ${authUser.name}! Role: ${authUser.role}. Redirecting...`,
          });
          // Redirect based on role, or always to dashboard
          if (authUser.role === 'admin' || authUser.role === 'physician') {
            router.push('/admin/dashboard');
          } else {
            // Potentially a customer-specific dashboard or homepage
            router.push('/admin/dashboard'); // Defaulting to admin dashboard for now
          }
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password, or account is inactive.",
            variant: "destructive",
          });
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Login error:", error);
        toast({
          title: "Login Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    });
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
