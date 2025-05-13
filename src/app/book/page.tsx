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
import type { Physician } from '@/actions/physicianActions'; // Use Physician type from actions
import { fetchMockPhysicians } from '@/actions/physicianActions'; // Use mock fetch function

// Interface for physician details used in this page
interface PhysicianDetailsPage extends Physician {}

export default function GenericBookingPage() {
  const [selectedPhysicianId, setSelectedPhysicianId] = useState<string | undefined>(undefined);
  const [selectedPhysicianDetails, setSelectedPhysicianDetails] = useState<PhysicianDetailsPage | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [allPhysicians, setAllPhysicians] = useState<Physician[]>([]); // Store all physicians for local lookup

  // Fetch all physicians once to avoid multiple calls
  useEffect(() => {
    const loadInitialPhysicians = async () => {
      setIsLoadingDetails(true); // Use this for initial load as well
      try {
        const physiciansList = await fetchMockPhysicians();
        setAllPhysicians(physiciansList);
      } catch (error) {
        console.error("Failed to fetch initial physicians list:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    loadInitialPhysicians();
  }, []);


  const findPhysicianDetails = (id: string) => {
    setIsLoadingDetails(true);
    // Simulate async fetch, but use local data
    setTimeout(() => {
      const details = allPhysicians.find(p => p._id === id);
      setSelectedPhysicianDetails(details || null);
      setIsLoadingDetails(false);
    }, 200); // Short delay to mimic network
  };
  
  const handlePhysicianSelect = (id: string | undefined) => {
    setSelectedPhysicianId(id);
    if (id) {
      findPhysicianDetails(id);
    } else {
      setSelectedPhysicianDetails(null);
    }
  };

  const handleResetSelection = () => {
    setSelectedPhysicianId(undefined);
    setSelectedPhysicianDetails(null);
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
                  physiciansList={allPhysicians} // Pass fetched list to selector
                  isLoading={isLoadingDetails && allPhysicians.length === 0} // Selector handles its own loading text based on this
                />
              </div>
            </CardContent>
          </Card>
        ) : isLoadingDetails ? (
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
        ) : (
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
