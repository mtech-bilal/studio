// src/app/book/page.tsx
"use client";

import React, { useState } from 'react';
import { BookingForm } from '@/components/BookingForm';
import { PhysicianSelector } from '@/components/PhysicianSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Stethoscope } from 'lucide-react';

// Mock data structure - ensure this matches the data structure in PhysicianSelector and potentially PhysicianManagement
interface Physician {
  id: string;
  name: string;
  specialty: string;
  ratePhysical: number | null;
  rateOnline: number | null;
}

// Mock function to get physician details by ID - replace with actual data fetching
// This needs to return the full details matching the Physician interface if needed
const getPhysicianDetails = (id: string): Physician | null => {
  // Re-use or fetch data consistent with PhysicianSelector's source
    const physicians: Physician[] = [
      { id: "dr-smith", name: "Dr. John Smith", specialty: "Cardiologist", ratePhysical: 150, rateOnline: 75 },
      { id: "dr-jones", name: "Dr. Sarah Jones", specialty: "Dermatologist", ratePhysical: 120, rateOnline: 60 },
      { id: "dr-williams", name: "Dr. Robert Williams", specialty: "Pediatrician", ratePhysical: 100, rateOnline: 50 },
      { id: "dr-brown", name: "Dr. Emily Brown", specialty: "General Practitioner", ratePhysical: 90, rateOnline: 45 },
    ];
  return physicians.find(p => p.id === id) || null;
};


export default function GenericBookingPage() {
  const [selectedPhysicianId, setSelectedPhysicianId] = useState<string | undefined>(undefined);
  const [selectedPhysicianDetails, setSelectedPhysicianDetails] = useState<Physician | null>(null);

  const handlePhysicianSelect = (id: string | undefined) => {
    setSelectedPhysicianId(id);
    if (id) {
      const details = getPhysicianDetails(id);
      setSelectedPhysicianDetails(details);
    } else {
      setSelectedPhysicianDetails(null);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        {!selectedPhysicianDetails ? (
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                 <Stethoscope className="h-6 w-6 text-primary" /> Select a Physician
              </CardTitle>
              <CardDescription>Choose the specialist you'd like to book an appointment with.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="physician-select">Physician</Label>
                <PhysicianSelector
                  value={selectedPhysicianId}
                  onValueChange={handlePhysicianSelect}
                  aria-label="Select Physician"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Optionally display selected physician info here before the form */}
             {/* <Card className="mb-6 bg-muted/50">
                <CardHeader>
                   <CardTitle className="text-xl">Selected Physician</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="font-medium">{selectedPhysicianDetails.name}</p>
                   <p className="text-sm text-muted-foreground">{selectedPhysicianDetails.specialty}</p>
                </CardContent>
             </Card>
             <Separator className="my-6"/> */}
            <BookingForm
              physicianId={selectedPhysicianDetails.id}
              physicianName={selectedPhysicianDetails.name}
              // Pass rates if BookingForm needs them
              // ratePhysical={selectedPhysicianDetails.ratePhysical}
              // rateOnline={selectedPhysicianDetails.rateOnline}
            />
             <Button variant="link" onClick={() => handlePhysicianSelect(undefined)} className="mt-4">
                 Change Physician
             </Button>
          </>
        )}
      </div>
    </main>
  );
}
