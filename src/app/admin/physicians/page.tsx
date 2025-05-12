// src/app/admin/physicians/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal, UserPlus, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data structure including rates - replace with actual data fetching and state management
interface Physician {
  id: string;
  name: string;
  specialty: string;
  ratePhysical: number | null;
  rateOnline: number | null;
}

const initialPhysicians: Physician[] = [
  { id: "dr-smith", name: "Dr. John Smith", specialty: "Cardiologist", ratePhysical: 150, rateOnline: 75 },
  { id: "dr-jones", name: "Dr. Sarah Jones", specialty: "Dermatologist", ratePhysical: 120, rateOnline: 60 },
  { id: "dr-williams", name: "Dr. Robert Williams", specialty: "Pediatrician", ratePhysical: 100, rateOnline: 50 },
  { id: "dr-brown", name: "Dr. Emily Brown", specialty: "General Practitioner", ratePhysical: 90, rateOnline: 45 },
];

const formatCurrency = (amount: number | null) => {
  if (amount === null || isNaN(amount)) return "N/A";
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function PhysicianManagementPage() {
  const [physicians, setPhysicians] = useState<Physician[]>(initialPhysicians);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhysician, setEditingPhysician] = useState<Physician | null>(null);

  // Form state for adding/editing
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [ratePhysical, setRatePhysical] = useState<string>('');
  const [rateOnline, setRateOnline] = useState<string>('');

  const handleOpenDialog = (physician: Physician | null = null) => {
    setEditingPhysician(physician);
    if (physician) {
      setName(physician.name);
      setSpecialty(physician.specialty);
      setRatePhysical(physician.ratePhysical?.toString() ?? '');
      setRateOnline(physician.rateOnline?.toString() ?? '');
    } else {
      // Reset form for adding new
      setName('');
      setSpecialty('');
      setRatePhysical('');
      setRateOnline('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPhysician(null); // Reset editing state
  };

  const handleSavePhysician = () => {
    const physicalRate = parseFloat(ratePhysical) || null;
    const onlineRate = parseFloat(rateOnline) || null;

    if (editingPhysician) {
      // Update existing physician
      setPhysicians(physicians.map(p =>
        p.id === editingPhysician.id
          ? { ...p, name, specialty, ratePhysical: physicalRate, rateOnline: onlineRate }
          : p
      ));
    } else {
      // Add new physician (generate a simple ID for mock)
      const newPhysician: Physician = {
        id: `dr-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name,
        specialty,
        ratePhysical: physicalRate,
        rateOnline: onlineRate,
      };
      setPhysicians([...physicians, newPhysician]);
    }
    handleCloseDialog();
  };

  const handleDeletePhysician = (id: string) => {
     // Add confirmation dialog in real app
     setPhysicians(physicians.filter(p => p.id !== id));
  };


  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Physician Management</h1>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
           <DialogTrigger asChild>
             <Button onClick={() => handleOpenDialog()}>
                <UserPlus className="mr-2 h-4 w-4" /> Add New Physician
             </Button>
           </DialogTrigger>
           <DialogContent className="sm:max-w-[425px]">
             <DialogHeader>
               <DialogTitle>{editingPhysician ? 'Edit Physician' : 'Add New Physician'}</DialogTitle>
               <DialogDescription>
                 {editingPhysician ? 'Update the details for this physician.' : 'Enter the details for the new physician.'}
               </DialogDescription>
             </DialogHeader>
             <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="name" className="text-right">Name</Label>
                 <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="Dr. Jane Doe" />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="specialty" className="text-right">Specialty</Label>
                 <Input id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="col-span-3" placeholder="Neurologist" />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="ratePhysical" className="text-right">Physical Rate ($)</Label>
                 <Input id="ratePhysical" type="number" value={ratePhysical} onChange={(e) => setRatePhysical(e.target.value)} className="col-span-3" placeholder="e.g., 150" />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="rateOnline" className="text-right">Online Rate ($)</Label>
                 <Input id="rateOnline" type="number" value={rateOnline} onChange={(e) => setRateOnline(e.target.value)} className="col-span-3" placeholder="e.g., 75" />
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
               <Button onClick={handleSavePhysician}>Save Physician</Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>


      <Card>
        <CardHeader>
          <CardTitle>Physicians List</CardTitle>
          <CardDescription>Manage physician details and consultation rates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead className="text-right">Physical Rate</TableHead>
                <TableHead className="text-right">Online Rate</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {physicians.map((physician) => (
                <TableRow key={physician.id}>
                  <TableCell className="font-medium">{physician.name}</TableCell>
                  <TableCell>{physician.specialty}</TableCell>
                  <TableCell className="text-right">{formatCurrency(physician.ratePhysical)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(physician.rateOnline)}</TableCell>
                  <TableCell>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(physician)}>
                           <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePhysician(physician.id)}>
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
