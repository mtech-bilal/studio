"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

// Mock available time slots for a given date
const getMockSlots = (date: Date | undefined): string[] => {
  if (!date) return [];
  // Simple logic: more slots on weekdays, fewer on weekends
  const day = date.getDay();
  if (day === 0 || day === 6) { // Sunday or Saturday
    return ["10:00 AM", "11:00 AM"];
  } else {
    return [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
      "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
      "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
      "04:00 PM",
    ];
  }
};

interface TimeSlotSelectorProps {
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onTimeSelect: (time: string) => void;
}

export function TimeSlotSelector({ selectedDate, selectedTime, onTimeSelect }: TimeSlotSelectorProps) {
  const availableSlots = getMockSlots(selectedDate);
  const [isLoading, setIsLoading] = useState(false); // Simulate loading state

  const handleSelect = (time: string) => {
    setIsLoading(true);
    // Simulate async operation like checking real-time availability
    setTimeout(() => {
       onTimeSelect(time);
       setIsLoading(false);
    }, 300); // Short delay for visual feedback
  };

  if (!selectedDate) {
    return <p className="text-muted-foreground text-sm">Please select a date first.</p>;
  }

  if (availableSlots.length === 0) {
     return <p className="text-muted-foreground text-sm">No available slots for this date.</p>;
  }


  return (
    <div className="space-y-4">
       <h3 className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Available Slots
       </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {availableSlots.map((time) => {
          const isSelected = time === selectedTime;
          return (
            <Button
              key={time}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => handleSelect(time)}
              disabled={isLoading && !isSelected} // Disable others while loading one
              className={cn(
                "transition-all duration-150 ease-in-out",
                isSelected && "ring-2 ring-primary ring-offset-2",
                !isSelected && "hover:bg-accent/10 hover:border-accent",
                 // Use accent color for available slots background/border on hover
                "bg-accent/5 border-accent/30 text-accent-foreground hover:bg-accent/20 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"

              )}
              data-selected={isSelected}
            >
              {time}
            </Button>
          );
        })}
      </div>
       {isLoading && <p className="text-sm text-muted-foreground animate-pulse">Checking availability...</p>}
    </div>
  );
}
