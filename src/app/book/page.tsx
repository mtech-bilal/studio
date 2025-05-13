// src/app/book/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { BookingForm } from '@/components/BookingForm';
import { PhysicianSelector } from '@/components/PhysicianSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Stethoscope, RotateCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Physician } from '@/actions/physicianActions';
import { fetchPhysicians } from '@/actions/physicianActions'; // Use Sanity action

export default function GenericBookingPage() {
  const [selectedPhysicianId, setSelectedPhysicianId] = useState<string | undefined>(undefined);
  const [selectedPhysicianDetails, setSelectedPhysicianDetails] = useState<Physician | null>(null);
  const [isLoadingPhysicians, setIsLoadingPhysicians] = useState(true); // For PhysicianSelector
  const [isLoadingDetails, setIsLoadingDetails] = useState(false); // For BookingForm after selection
  const [allPhysicians, setAllPhysicians] = useState<Physician[]>([]);

  useEffect(() => {
    const loadInitialPhysicians = async () => {
      setIsLoadingPhysicians(true);
      try {
        const physiciansList = await fetchPhysicians();
        setAllPhysicians(physiciansList);
      } catch (error) {
        console.error("Failed to fetch initial physicians list:", error);
        // Optionally, show a toast to the user
      } finally {
        setIsLoadingPhysicians(false);
      }
    };
    loadInitialPhysicians();
  }, []);


  const findPhysicianDetailsLocally = (id: string) => {
    const details = allPhysicians.find(p => p._id === id);
    setSelectedPhysicianDetails(details || null);
  };
  
  const handlePhysicianSelect = (id: string | undefined) => {
    setSelectedPhysicianId(id);
    if (id) {
      setIsLoadingDetails(true); // Show loading for form section
      findPhysicianDetailsLocally(id); // Use local data for details
      // Simulate a short delay if desired, or remove if instant update is fine
      setTimeout(() => setIsLoadingDetails(false), 100); 
    } else {
      setSelectedPhysicianDetails(null);
      setIsLoadingDetails(false);
    }
  };

  const handleResetSelection = () => {
    setSelectedPhysicianId(undefined);
    setSelectedPhysicianDetails(null);
    setIsLoadingDetails(false);
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        {!selectedPhysicianId ? (
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
                  id="physician-select"
                  physiciansList={allPhysicians}
                  isLoading={isLoadingPhysicians}
                />
              </div>
            </CardContent>
          </Card>
        ) : isLoadingDetails ? ( // This state shows loading for the BookingForm section
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : selectedPhysicianDetails ? (
          <>
            <BookingForm
              physicianId={selectedPhysicianDetails._id}
              physicianName={selectedPhysicianDetails.name}
            />
             <Button variant="outline" onClick={handleResetSelection} className="mt-4 w-full sm:w-auto">
                 <RotateCcw className="mr-2 h-4 w-4" /> Change Physician
             </Button>
          </>
        ) : ( // This case occurs if physicianId was selected but details weren't found (should be rare with local search)
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-destructive">Physician Not Found</CardTitle>
              <CardDescription>The selected physician details could not be loaded. Please try again.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="outline" onClick={handleResetSelection} className="w-full">
                 <RotateCcw className="mr-2 h-4 w-4" /> Select a Different Physician
               </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
