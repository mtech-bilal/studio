// src/components/BookingForm.tsx
"use client";

import React, { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimeSlotSelector } from '@/components/TimeSlotSelector';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar as CalendarIcon } from 'lucide-react';
import { format, parse, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { submitBooking, type BookingResult } from '@/actions/bookingActions'; // Import Server Action

interface BookingFormProps {
  physicianId: string;
  physicianName: string;
}

export function BookingForm({ physicianId, physicianName }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime || !name || !email) {
      toast({
         title: "Missing Information",
         description: "Please fill in all fields and select a date/time.",
         variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Combine date and time into a single ISO string for Sanity
    // Parse time like "09:00 AM"
    const timeParts = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) {
        toast({ title: "Invalid Time", description: "Selected time format is incorrect.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }
    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const ampm = timeParts[3].toUpperCase();

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0; // Midnight case

    const bookingDateTime = setMilliseconds(setSeconds(setMinutes(setHours(selectedDate, hours), minutes),0),0);
    const bookingDateTimeISO = bookingDateTime.toISOString();

    const bookingData = {
      customerName: name,
      customerEmail: email,
      physicianId: physicianId,
      bookingDateTime: bookingDateTimeISO,
      // serviceType: 'physical', // Or determine based on selection if applicable
      status: 'pending',
    };
    
    startTransition(async () => {
        const result = await submitBooking(bookingData);
        if (result.success && result.booking) {
          const confirmedBooking = result.booking as BookingResult;
          const queryParams = new URLSearchParams({
            physician: confirmedBooking.physician?.name || physicianName, // Use name from result or prop
            date: format(new Date(confirmedBooking.bookingDateTime), 'PPP'),
            time: format(new Date(confirmedBooking.bookingDateTime), 'p'),
          }).toString();
    
          router.push(`/book/${physicianId}/confirm?${queryParams}`);
        } else {
          toast({
            title: "Booking Failed",
            description: result.error || "Could not schedule your appointment. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
        }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Book Appointment with {physicianName}</CardTitle>
        <CardDescription>Select an available date and time slot below.</CardDescription>
      </CardHeader>
      <form onSubmit={handleBookingSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
             <Label className="flex items-center gap-2 font-medium text-lg">
                <CalendarIcon className="h-5 w-5 text-primary" /> Select Date
             </Label>
            <div className="flex justify-center rounded-md border p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => { setSelectedDate(date); setSelectedTime(undefined); }}
                fromDate={new Date()}
                className="p-0"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </div>

          <Separator />

          {selectedDate && (
             <TimeSlotSelector
               selectedDate={selectedDate}
               selectedTime={selectedTime}
               onTimeSelect={setSelectedTime}
             />
          )}

          {selectedDate && selectedTime && (
            <>
              <Separator />
               <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                     <User className="h-5 w-5 text-primary" /> Your Information
                  </h3>
                 <div className="space-y-2">
                   <Label htmlFor="name">Full Name</Label>
                   <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="email">Email Address</Label>
                   <Input
                     id="email"
                     type="email"
                     placeholder="john.doe@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     disabled={isSubmitting}
                   />
                 </div>
               </div>
             </>
          )}

        </CardContent>
        {selectedDate && selectedTime && name && email && (
           <CardFooter>
             <Button
                type="submit"
                className="w-full"
                disabled={!selectedDate || !selectedTime || !name || !email || isSubmitting}
              >
               {isSubmitting ? "Booking..." : "Confirm Booking"}
             </Button>
           </CardFooter>
        )}
      </form>
    </Card>
  );
}
