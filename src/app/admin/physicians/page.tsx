// src/app/admin/physicians/page.tsx
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Edit, Trash2, Stethoscope, Monitor, Users as UsersIcon } from "lucide-react";
import { PaginationControls } from '@/components/PaginationControls';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchPhysicians, deletePhysician, type Physician } from '@/actions/physicianActions';

const ITEMS_PER_PAGE = 6;

const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "N/A";
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export default function PhysicianManagementPage() {
  const [physicians, setPhysicians] = useState<Physician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | false>(false); // Store ID of physician being deleted
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const loadPhysicians = async () => {
    setIsLoading(true);
    try {
      const physiciansList = await fetchPhysicians();
      // Sorting can be done here if not handled by Sanity query
      // physiciansList.sort((a, b) => a.name.localeCompare(b.name));
      setPhysicians(physiciansList);
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

  const handleDeletePhysician = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete Dr. ${name}? This action cannot be undone.`)) return;
    setIsDeleting(id);
    startTransition(async () => {
      try {
        await deletePhysician(id);
        toast({ title: "Success", description: `Dr. ${name} has been deleted.`});
        const newList = await fetchPhysicians();
        setPhysicians(newList);
        const newTotalPages = Math.ceil(newList.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (newList.length === 0) {
            setCurrentPage(1);
        }
      } catch (error: any) {
        console.error("Failed to delete physician:", error);
        toast({ title: "Error", description: error.message || "Could not delete physician.", variant: "destructive" });
      } finally {
          setIsDeleting(false);
      }
    });
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
         <Button asChild>
            <Link href="/admin/physicians/add">
                <UserPlus className="mr-2 h-4 w-4" /> Add New Physician
            </Link>
         </Button>
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
                           <Button aria-haspopup="true" size="sm" variant="ghost" disabled={!!isDeleting}>
                             <MoreHorizontal className="h-4 w-4" />
                             <span className="sr-only">Actions</span>
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem asChild>
                             <Link href={`/admin/physicians/edit/${physician._id}`}>
                               <Edit className="mr-2 h-4 w-4" /> Edit
                             </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                            onClick={() => handleDeletePhysician(physician._id, physician.name)} 
                            disabled={isDeleting === physician._id}
                           >
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
