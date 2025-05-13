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
import { client } from "@/sanity/client";
import type { SanityDocument } from "next-sanity";

interface PhysicianOptionSanity extends SanityDocument {
  name: string;
  specialty: string;
}

interface PhysicianSelectorProps extends SelectProps {
   onValueChange?: (value: string) => void;
   value?: string;
}

export function PhysicianSelector({ onValueChange, value, ...props }: PhysicianSelectorProps) {
  const [physicians, setPhysicians] = React.useState<PhysicianOptionSanity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPhysicians = async () => {
      setIsLoading(true);
      try {
        const query = '*[_type == "physician"]{_id, name, specialty} | order(name asc)';
        const sanityPhysicians: PhysicianOptionSanity[] = await client.fetch(query);
        setPhysicians(sanityPhysicians);
      } catch (error) {
        console.error("Failed to fetch physicians for selector:", error);
        // Handle error appropriately in UI if needed
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhysicians();
  }, []);

  return (
    <Select onValueChange={onValueChange} value={value} {...props} disabled={isLoading || physicians.length === 0}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Loading physicians..." : "Select a Physician"} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>Loading...</SelectItem>
        ) : physicians.length === 0 ? (
          <SelectItem value="no-physicians" disabled>No physicians available</SelectItem>
        ) : (
          physicians.map((physician) => (
            <SelectItem key={physician._id} value={physician._id}>
              {physician.name} - {physician.specialty}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
