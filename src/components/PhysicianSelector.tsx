// src/components/PhysicianSelector.tsx
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectProps } from "@radix-ui/react-select";
import type { Physician } from "@/actions/physicianActions"; // Use Physician type from actions
// Removed Sanity client import

interface PhysicianSelectorProps extends SelectProps {
   onValueChange?: (value: string) => void;
   value?: string;
   physiciansList?: Physician[]; // Optional: pass pre-fetched list
   isLoading?: boolean; // Optional: parent can control loading state
}

export function PhysicianSelector({ 
    onValueChange, 
    value, 
    physiciansList, 
    isLoading: parentIsLoading, 
    ...props 
}: PhysicianSelectorProps) {
  // Use the passed list if available, otherwise an empty array
  const physiciansToDisplay = physiciansList || [];
  // isLoading is true if parent says so, or if no list is provided yet (implying it might be loading internally - though this component no longer fetches)
  const isLoading = parentIsLoading !== undefined ? parentIsLoading : !physiciansList;


  return (
    <Select 
        onValueChange={onValueChange} 
        value={value} 
        {...props} 
        disabled={isLoading || physiciansToDisplay.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Loading physicians..." : (physiciansToDisplay.length === 0 ? "No physicians available" : "Select a Physician")} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>Loading...</SelectItem>
        ) : physiciansToDisplay.length === 0 ? (
          <SelectItem value="no-physicians" disabled>No physicians available</SelectItem>
        ) : (
          physiciansToDisplay.map((physician) => (
            <SelectItem key={physician._id} value={physician._id}>
              {physician.name} - {physician.specialty}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
