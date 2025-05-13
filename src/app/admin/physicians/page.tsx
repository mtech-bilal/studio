// src/app/admin/physicians/page.tsx
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Edit, Trash2, Stethoscope, Monitor, Users as UsersIcon } from "lucide-react"; // Renamed Users to UsersIcon to avoid conflict
import { PaginationControls } from '@/components/PaginationControls';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMockPhysicians, createPhysician, updatePhysician, deletePhysician, type Physician, type PhysicianInputData } from '@/actions/physicianActions';


const ITEMS_PER_PAGE = 6;

const formatCurrency = (amount: number | null) => {
  if (amount === null || isNaN(amount)) return "N/A";
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};


export default function PhysicianManagementPage() {
  const [physicians, setPhysicians] = useState<Physician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhysician, setEditingPhysician] = useState<Physician | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Form state for adding/editing
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [ratePhysical, setRatePhysical] = useState<string>('');
  const [rateOnline, setRateOnline] = useState<string>('');

  const loadPhysicians = async () => {
    setIsLoading(true);
    try {
      const mockPhysiciansList = await fetchMockPhysicians();
      // Sort by createdAt descending if available, otherwise by name or _id as fallback
      mockPhysiciansList.sort((a, b) => {
        if (a._createdAt && b._createdAt) return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
        return a.name.localeCompare(b.name);
      });
      setPhysicians(mockPhysiciansList);
    } catch (error) {
      console.error("Failed to fetch physicians:", error);
      toast({ title: "Error", description: "Could not fetch physicians.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPhysicians();
  }, []);

  const totalPhysicians = physicians.length;
  const totalPages = Math.ceil(totalPhysicians / ITEMS_PER_PAGE);
  const currentPhysicians = physicians.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleOpenDialog = (physician: Physician | null = null) => {
    setEditingPhysician(physician);
    if (physician) {
      setName(physician.name);
      setSpecialty(physician.specialty);
      setRatePhysical(physician.ratePhysical?.toString() ?? '');
      setRateOnline(physician.rateOnline?.toString() ?? '');
    } else {
      setName(''); setSpecialty(''); setRatePhysical(''); setRateOnline('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPhysician(null);
  };

  const handleSavePhysician = async () => {
    const physicalRate = parseFloat(ratePhysical) || null;
    const onlineRate = parseFloat(rateOnline) || null;

    if (!name.trim() || !specialty.trim()) {
        toast({title: "Validation Error", description: "Name and Specialty are required.", variant: "destructive"});
        return;
    }

    const physicianData: PhysicianInputData = { name, specialty, ratePhysical: physicalRate, rateOnline: onlineRate };

    try {
      setIsLoading(true); // Indicate loading for the save operation
      if (editingPhysician) {
        startTransition(async () => {
            await updatePhysician(editingPhysician._id, physicianData);
            toast({ title: "Success", description: "Physician updated."});
            await loadPhysicians(); // Refresh list
            handleCloseDialog();
        });
      } else {
        startTransition(async () => {
            await createPhysician(physicianData);
            toast({ title: "Success", description: "Physician added."});
            await loadPhysicians(); // Refresh list
            handleCloseDialog();
        });
      }
    } catch (error) {
      console.error("Failed to save physician:", error);
      toast({ title: "Error", description: "Could not save physician.", variant: "destructive" });
    } finally {
      setIsLoading(false); // Reset loading state after operation
    }
  };

  const handleDeletePhysician = async (id: string) => {
    if (!confirm("Are you sure you want to delete this physician?")) return;
    try {
      setIsLoading(true);
      startTransition(async () => {
        await deletePhysician(id);
        toast({ title: "Success", description: "Physician deleted."});
        await loadPhysicians();
        const newTotalPages = Math.ceil((physicians.length - 1) / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (physicians.length -1 === 0) { // Check actual length after potential deletion
            setCurrentPage(1);
        }
      });
    } catch (error) {
      console.error("Failed to delete physician:", error);
      toast({ title: "Error", description: "Could not delete physician.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading && physicians.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-1/3" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-1/2 mt-1" /></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <Card key={i} className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full mt-2" />
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Physician Management</h1>
         <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) handleCloseDialog(); else setIsDialogOpen(true);}}>
           <DialogTrigger asChild>
             <Button onClick={() => handleOpenDialog()}>
                <UserPlus className="mr-2 h-4 w-4" /> Add New Physician
             </Button>
           </DialogTrigger>
           <DialogContent className="sm:max-w-[425px]">
             <DialogHeader>
               <DialogTitle>{editingPhysician ? 'Edit Physician' : 'Add New Physician'}</DialogTitle>
               <DialogDescription>
                 {editingPhysician ? 'Update details.' : 'Enter new physician details.'}
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
               <Button onClick={handleSavePhysician} disabled={isLoading}>
                 {isLoading && editingPhysician ? 'Saving...' : isLoading ? 'Adding...' : 'Save Physician'}
                </Button>
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
                   <Card key={physician._id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
                     <CardHeader className="pb-3">
                       <CardTitle className="text-lg">{physician.name}</CardTitle>
                       <CardDescription className="flex items-center pt-1">
                          <Stethoscope className="h-4 w-4 mr-1.5 text-muted-foreground" /> {physician.specialty}
                       </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-2 text-sm pt-0 pb-4">
                       <div className="flex items-center">
                         <UsersIcon className="h-4 w-4 mr-1.5 text-primary" />
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
                           <Button aria-haspopup="true" size="sm" variant="ghost" disabled={isLoading}>
                             <MoreHorizontal className="h-4 w-4" />
                             <span className="sr-only">Actions</span>
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem onClick={() => handleOpenDialog(physician)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDeletePhysician(physician._id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </CardFooter>
                   </Card>
                 ))}
               </div>
               {totalPages > 1 && (
                 <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalItems={totalPhysicians}
                  />
               )}
            </>
           ) : (
              <p className="text-center text-muted-foreground py-8">{isLoading ? 'Loading...' : 'No physicians found. Add one to get started.'}</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
