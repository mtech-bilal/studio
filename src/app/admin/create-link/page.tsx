// src/app/admin/create-link/page.tsx
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Removed PhysicianSelector import
// Removed Label import (no longer needed for selector)
import { GeneratedLinkCard } from "@/components/GeneratedLinkCard";
import { Link as LinkIcon, ClipboardCheck } from 'lucide-react'; // Added ClipboardCheck

export default function CreateLinkPage() {
  // Removed selectedPhysicianId state
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkGenerated, setLinkGenerated] = useState<boolean>(false);
  // Removed physicianName state

  const handleGenerateLink = () => {
      // Generate the generic booking link
      const link = `/book`;
      setGeneratedLink(link);
      setLinkGenerated(true); // Indicate link has been generated
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create Generic Booking Link</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Link</CardTitle>
          <CardDescription>
            Create a single shareable link for customers to book appointments. They will select the physician during the booking process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {/* Removed Physician Selector */}
          <Button onClick={handleGenerateLink} disabled={linkGenerated}>
             {linkGenerated ? <ClipboardCheck className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
             {linkGenerated ? 'Link Generated' : 'Generate Link'}
          </Button>
        </CardContent>
      </Card>

      {generatedLink && (
        // Use a generic name for the card title
        <GeneratedLinkCard physicianName="General Booking Link" link={generatedLink} />
      )}
    </div>
  );
}
