// src/app/admin/customers/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, CalendarDays, Hash } from "lucide-react";
import { format } from 'date-fns';
import { PaginationControls } from '@/components/PaginationControls'; // Import pagination

// Mock data - replace with actual data fetching
const allCustomers = [
  { id: "cust1", name: "John Patient", email: "john.p@mail.com", lastBooking: new Date(2024, 6, 15), totalBookings: 3 },
  { id: "cust2", name: "Sarah Visitor", email: "sarah.v@mail.net", lastBooking: new Date(2024, 7, 1), totalBookings: 1 },
  { id: "cust3", name: "Mike Frequent", email: "mike.f@email.org", lastBooking: new Date(2024, 7, 20), totalBookings: 5 },
  { id: "cust4", name: "Linda New", email: "linda.n@web.dev", lastBooking: new Date(2024, 5, 10), totalBookings: 1 },
  { id: "cust5", name: "George Regular", email: "george.r@post.co", lastBooking: new Date(2024, 7, 28), totalBookings: 8 },
  { id: "cust6", name: "Emily Client", email: "emily.c@provider.com", lastBooking: new Date(2024, 7, 5), totalBookings: 2 },
  { id: "cust7", name: "David Booker", email: "david.b@mail.com", lastBooking: new Date(2024, 6, 30), totalBookings: 4 },
  { id: "cust8", name: "Olivia User", email: "olivia.u@service.net", lastBooking: new Date(2024, 7, 18), totalBookings: 1 },
  { id: "cust9", name: "James Guest", email: "james.g@guest.org", lastBooking: new Date(2024, 7, 22), totalBookings: 3 },
  { id: "cust10", name: "Sophia Repeat", email: "sophia.r@mail.com", lastBooking: new Date(2024, 7, 25), totalBookings: 6 },
];

const ITEMS_PER_PAGE = 6; // Number of cards per page

export default function CustomerManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalCustomers = allCustomers.length;
  const totalPages = Math.ceil(totalCustomers / ITEMS_PER_PAGE);

  // Calculate the customers to display for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCustomers = allCustomers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
         {/* Add Customer button might not be applicable */}
       </div>

       <Card>
         <CardHeader>
           <CardTitle>Customers</CardTitle>
           <CardDescription>View customers who have booked appointments.</CardDescription>
         </CardHeader>
         <CardContent>
           {currentCustomers.length > 0 ? (
             <>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {currentCustomers.map((customer) => (
                   <Card key={customer.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
                     <CardHeader>
                       <CardTitle className="text-lg">{customer.name}</CardTitle>
                       <CardDescription className="flex items-center pt-1">
                         <Mail className="h-4 w-4 mr-1.5 text-muted-foreground" /> {customer.email}
                       </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-2 text-sm">
                       <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1.5 text-primary" />
                          Last Booking: {format(customer.lastBooking, 'PPP')}
                       </div>
                       <div className="flex items-center">
                          <Hash className="h-4 w-4 mr-1.5 text-primary" />
                          Total Bookings: {customer.totalBookings}
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
                           <DropdownMenuItem>View Details</DropdownMenuItem>
                           <DropdownMenuItem>Booking History</DropdownMenuItem>
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
                  totalItems={totalCustomers}
                />
             </>
           ) : (
             <p className="text-center text-muted-foreground py-8">No customers found.</p>
           )}
         </CardContent>
       </Card>
    </div>
  );
}
