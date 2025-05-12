"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";

interface GeneratedLinkCardProps {
  physicianName: string;
  link: string;
}

export function GeneratedLinkCard({ physicianName, link }: GeneratedLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

   useEffect(() => {
    // Ensure window is defined (runs only on client)
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const fullLink = origin ? `${origin}${link}` : link;


  const handleCopy = () => {
    navigator.clipboard.writeText(fullLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{physicianName}</CardTitle>
        <CardDescription>Booking link generated successfully.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input value={fullLink} readOnly className="flex-1" />
          <TooltipProvider>
            <Tooltip open={copied ? true : undefined}>
               <TooltipTrigger asChild>
                 <Button variant="outline" size="icon" onClick={handleCopy}>
                   {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                 </Button>
               </TooltipTrigger>
               <TooltipContent>
                 <p>{copied ? "Copied!" : "Copy link"}</p>
               </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="p-0 h-auto">
           <a href={fullLink} target="_blank" rel="noopener noreferrer">
              Preview Link
           </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
