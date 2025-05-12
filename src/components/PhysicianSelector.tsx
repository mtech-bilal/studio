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

// Mock data structure including specialty and rates
interface PhysicianOption {
  id: string;
  name: string;
  specialty: string;
  // Rates can be added if needed for display within the selector itself,
  // but usually fetched separately after selection.
  // ratePhysical: number | null;
  // rateOnline: number | null;
}

// Mock data for physicians - replace with actual data fetching
// Ensure this data is consistent across the application (e.g., admin pages)
const physicians: PhysicianOption[] = [
  { id: "dr-smith", name: "Dr. John Smith", specialty: "Cardiologist" },
  { id: "dr-jones", name: "Dr. Sarah Jones", specialty: "Dermatologist" },
  { id: "dr-williams", name: "Dr. Robert Williams", specialty: "Pediatrician" },
  { id: "dr-brown", name: "Dr. Emily Brown", specialty: "General Practitioner" },
  // Add more physicians as needed
  { id: "dr-chen", name: "Dr. Linda Chen", specialty: "Neurologist"},
  { id: "dr-patel", name: "Dr. Anil Patel", specialty: "Orthopedics"},
];

interface PhysicianSelectorProps extends SelectProps {
   onValueChange?: (value: string) => void;
   value?: string;
}


export function PhysicianSelector({ onValueChange, value, ...props }: PhysicianSelectorProps) {
  return (
    <Select onValueChange={onValueChange} value={value} {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Physician" />
      </SelectTrigger>
      <SelectContent>
        {physicians.map((physician) => (
          <SelectItem key={physician.id} value={physician.id}>
            {physician.name} - {physician.specialty}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
