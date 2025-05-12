// src/app/book/[physicianId]/confirm/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();

  // Read booking details from query parameters
  const physician = searchParams.get('physician');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  // Basic check if parameters exist
  if (!physician || !date || !time) {
    // Handle missing parameters, maybe redirect or show an error
     return (
        <main className="container mx-auto px-4 py-12 flex justify-center">
          <Card className="w-full max-w-lg text-center shadow-lg">
             <CardHeader>
                <CardTitle className="text-destructive">Booking Error</CardTitle>
                <CardDescription>Could not retrieve booking details. Please try again.</CardDescription>
             </CardHeader>
             <CardContent>
                 <Button asChild>
                    <Link href="/">Go Home</Link>
                 </Button>
             </CardContent>
          </Card>
        </main>
      );
  }


  return (
    <main className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center shadow-xl overflow-hidden">
         <div className="bg-accent p-6 flex justify-center items-center">
            <CheckCircle className="h-16 w-16 text-accent-foreground" />
         </div>
        <CardHeader className="pt-6">
          <CardTitle className="text-2xl font-bold text-primary">Appointment Confirmed!</CardTitle>
          <CardDescription className="text-lg">
            Your booking has been successfully scheduled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-left px-6 pb-6">
           <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
               <User className="h-5 w-5 text-primary flex-shrink-0" />
               <div>
                  <p className="text-sm text-muted-foreground">Physician</p>
                  <p className="font-medium">{physician}</p>
               </div>
           </div>
           <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
               <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
               <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{date}</p>
                </div>
           </div>
           <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
               <Clock className="h-5 w-5 text-primary flex-shrink-0" />
               <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{time}</p>
               </div>
           </div>
          <p className="text-sm text-muted-foreground pt-4">
            You should receive an email confirmation shortly. Please contact us if you have any questions.
          </p>
          <Button asChild className="w-full mt-4">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
