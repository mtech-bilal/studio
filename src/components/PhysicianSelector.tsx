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

// Mock data for physicians
const physicians = [
  { id: "dr-smith", name: "Dr. John Smith - Cardiologist" },
  { id: "dr-jones", name: "Dr. Sarah Jones - Dermatologist" },
  { id: "dr-williams", name: "Dr. Robert Williams - Pediatrician" },
  { id: "dr-brown", name: "Dr. Emily Brown - General Practitioner" },
];

interface PhysicianSelectorProps extends SelectProps {
   onValueChange?: (value: string) => void;
   value?: string;
}


export function PhysicianSelector({ onValueChange, value, ...props }: PhysicianSelectorProps) {
  return (
    <Select onValueChange={onValueChange} value={value} {...props}>
      <SelectTrigger className="w-full md:w-[280px]">
        <SelectValue placeholder="Select a Physician" />
      </SelectTrigger>
      <SelectContent>
        {physicians.map((physician) => (
          <SelectItem key={physician.id} value={physician.id}>
            {physician.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
