// src/components/BookingForm.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimeSlotSelector } from '@/components/TimeSlotSelector';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface BookingFormProps {
  physicianId: string;
  physicianName: string; // Add physicianName prop
  // Optionally receive rates if they influence available slots or displayed info
  // ratePhysical?: number | null;
  // rateOnline?: number | null;
}

export function BookingForm({ physicianId, physicianName }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast(); // Initialize toast

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime || !name || !email) {
      toast({ // Use toast for feedback
         title: "Missing Information",
         description: "Please fill in all fields and select a date/time.",
         variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call/Server Action
    console.log("Booking details:", {
      physicianId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      name,
      email,
    });

    // In a real app, replace with actual booking logic (e.g., server action)
    // This action should handle potential errors and return success/failure.
    try {
       await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
       // Assume success for now

       // Redirect to confirmation page on success
       // Pass booking details via query params (simple approach, consider alternatives for sensitive data)
       const queryParams = new URLSearchParams({
         physician: physicianName, // Use the name here
         date: format(selectedDate, 'PPP'), // Format date nicely
         time: selectedTime,
       }).toString();

       // The confirmation page path now correctly includes the physicianId
       router.push(`/book/${physicianId}/confirm?${queryParams}`);

    } catch (error) {
       console.error("Booking failed:", error);
       toast({
          title: "Booking Failed",
          description: "Could not schedule your appointment. Please try again.",
          variant: "destructive",
       });
        setIsSubmitting(false);
    } finally {
       // Don't set submitting false here if redirecting on success
       // setIsSubmitting(false);
    }


  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Book Appointment with {physicianName}</CardTitle>
        <CardDescription>Select an available date and time slot below.</CardDescription>
      </CardHeader>
      <form onSubmit={handleBookingSubmit}>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
             <Label className="flex items-center gap-2 font-medium text-lg">
                <CalendarIcon className="h-5 w-5 text-primary" /> Select Date
             </Label>
            <div className="flex justify-center rounded-md border p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => { setSelectedDate(date); setSelectedTime(undefined); }} // Reset time on new date selection
                fromDate={new Date()} // Disable past dates
                className="p-0"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates more strictly
              />
            </div>
          </div>

          <Separator />

          {/* Time Selection */}
          {selectedDate && ( // Only show time slots if a date is selected
             <TimeSlotSelector
               selectedDate={selectedDate}
               selectedTime={selectedTime}
               onTimeSelect={setSelectedTime}
               // Pass physicianId if slots depend on the physician
               // physicianId={physicianId}
             />
          )}


          {selectedDate && selectedTime && ( // Only show customer info if date/time selected
            <>
              <Separator />
              {/* Customer Information */}
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
        {selectedDate && selectedTime && name && email && ( // Only show footer/button when form is ready
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

