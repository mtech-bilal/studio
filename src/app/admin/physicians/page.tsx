// src/app/admin/physicians/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Edit, Trash2, Stethoscope, Monitor, Users, DollarSign } from "lucide-react";
import { PaginationControls } from '@/components/PaginationControls'; // Import pagination

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
  { id: "dr-chen", name: "Dr. Linda Chen", specialty: "Neurologist", ratePhysical: 160, rateOnline: 80 },
  { id: "dr-patel", name: "Dr. Anil Patel", specialty: "Orthopedics", ratePhysical: 140, rateOnline: 70 },
  { id: "dr-garcia", name: "Dr. Maria Garcia", specialty: "Endocrinologist", ratePhysical: 155, rateOnline: 78 },
  { id: "dr-lee", name: "Dr. David Lee", specialty: "Ophthalmologist", ratePhysical: 130, rateOnline: 65 },
];

const ITEMS_PER_PAGE = 6; // Number of cards per page

const formatCurrency = (amount: number | null) => {
  if (amount === null || isNaN(amount)) return "N/A";
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export default function PhysicianManagementPage() {
  const [physicians, setPhysicians] = useState<Physician[]>(initialPhysicians);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhysician, setEditingPhysician] = useState<Physician | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state for adding/editing
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [ratePhysical, setRatePhysical] = useState<string>('');
  const [rateOnline, setRateOnline] = useState<string>('');

  const totalPhysicians = physicians.length;
  const totalPages = Math.ceil(totalPhysicians / ITEMS_PER_PAGE);

  // Calculate the physicians to display for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPhysicians = physicians.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
       // Go to the last page if a new item is added and it creates a new page
       const newTotalPages = Math.ceil((totalPhysicians + 1) / ITEMS_PER_PAGE);
       if (newTotalPages > totalPages) {
         setCurrentPage(newTotalPages);
       }
    }
    handleCloseDialog();
  };

  const handleDeletePhysician = (id: string) => {
     // Add confirmation dialog in real app
     setPhysicians(prev => {
         const updatedList = prev.filter(p => p.id !== id);
         const newTotalPages = Math.ceil(updatedList.length / ITEMS_PER_PAGE);
         if (currentPage > newTotalPages && newTotalPages > 0) {
             setCurrentPage(newTotalPages);
         } else if (updatedList.length === 0) {
             setCurrentPage(1);
         }
         return updatedList;
     });
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
           {currentPhysicians.length > 0 ? (
            <>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {currentPhysicians.map((physician) => (
                   <Card key={physician.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
                     <CardHeader className="pb-3">
                       <CardTitle className="text-lg">{physician.name}</CardTitle>
                       <CardDescription className="flex items-center pt-1">
                          <Stethoscope className="h-4 w-4 mr-1.5 text-muted-foreground" /> {physician.specialty}
                       </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-2 text-sm pt-0 pb-4">
                       <div className="flex items-center">
                         <Users className="h-4 w-4 mr-1.5 text-primary" />
                         Physical Rate: <span className="font-medium ml-1">{formatCurrency(physician.ratePhysical)}</span>
                       </div>
                       <div className="flex items-center">
                         <Monitor className="h-4 w-4 mr-1.5 text-primary" />
                         Online Rate: <span className="font-medium ml-1">{formatCurrency(physician.rateOnline)}</span>
                       </div>
                     </CardContent>
                     <CardFooter className="flex justify-end border-t pt-3 pb-3 px-4">
                        <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button aria-haspopup="true" size="sm" variant="ghost">
                             <MoreHorizontal className="h-4 w-4" />
                             <span className="sr-only">Actions</span>
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem onClick={() => handleOpenDialog(physician)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDeletePhysician(physician.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </CardFooter>
                   </Card>
                 ))}
               </div>
               <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={totalPhysicians}
                />
            </>
           ) : (
              <p className="text-center text-muted-foreground py-8">No physicians found. Add one to get started.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
