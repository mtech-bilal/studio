"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhysicianSelector } from "@/components/PhysicianSelector";
import { Label } from "@/components/ui/label";
import { GeneratedLinkCard } from "@/components/GeneratedLinkCard";
import { Link as LinkIcon } from 'lucide-react';

// Mock physician data (consistent with PhysicianSelector)
const physicians = [
  { id: "dr-smith", name: "Dr. John Smith - Cardiologist" },
  { id: "dr-jones", name: "Dr. Sarah Jones - Dermatologist" },
  { id: "dr-williams", name: "Dr. Robert Williams - Pediatrician" },
  { id: "dr-brown", name: "Dr. Emily Brown - General Practitioner" },
];


export default function CreateLinkPage() {
  const [selectedPhysicianId, setSelectedPhysicianId] = useState<string | undefined>(undefined);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [physicianName, setPhysicianName] = useState<string>('');

  const handleGenerateLink = () => {
    if (selectedPhysicianId) {
      const physician = physicians.find(p => p.id === selectedPhysicianId);
      if (physician) {
        // In a real app, this would likely involve a server action/API call
        // to create and store the link securely.
        const link = `/book/${selectedPhysicianId}`;
        setGeneratedLink(link);
        setPhysicianName(physician.name);
      } else {
         setGeneratedLink(null);
         setPhysicianName('');
      }

    } else {
      // Handle case where no physician is selected (e.g., show a toast)
      console.warn("Please select a physician first.");
       setGeneratedLink(null);
       setPhysicianName('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create Booking Link</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select Physician</CardTitle>
          <CardDescription>
            Choose the physician for whom you want to generate a booking link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="physician-select">Physician</Label>
            <PhysicianSelector
              value={selectedPhysicianId}
              onValueChange={setSelectedPhysicianId}
              aria-label="Select Physician"
              />
          </div>
          <Button onClick={handleGenerateLink} disabled={!selectedPhysicianId}>
             <LinkIcon className="mr-2 h-4 w-4" /> Generate Link
          </Button>
        </CardContent>
      </Card>

      {generatedLink && physicianName && (
        <GeneratedLinkCard physicianName={physicianName} link={generatedLink} />
      )}
    </div>
  );
}
