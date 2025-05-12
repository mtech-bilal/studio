// src/app/admin/payments/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Filter, Download, User, Calendar, Clock, Tag, DollarSign, CreditCard } from "lucide-react";
import { format } from 'date-fns';
import { PaginationControls } from '@/components/PaginationControls'; // Import pagination

// Mock data - replace with actual data fetching
const allPayments = [
  { id: "pay1", customer: "John Patient", physician: "Dr. Smith", date: new Date(2024, 6, 15, 10, 30), amount: 75.00, type: "Online", status: "Paid" },
  { id: "pay2", customer: "Sarah Visitor", physician: "Dr. Jones", date: new Date(2024, 7, 1, 14, 0), amount: 120.00, type: "Physical", status: "Paid" },
  { id: "pay3", customer: "Mike Frequent", physician: "Dr. Smith", date: new Date(2024, 7, 20, 9, 0), amount: 75.00, type: "Online", status: "Pending" },
  { id: "pay4", customer: "Anna Lee", physician: "Dr. Williams", date: new Date(2024, 7, 21, 11, 0), amount: 90.00, type: "Physical", status: "Paid" },
  { id: "pay5", customer: "George Regular", physician: "Dr. Brown", date: new Date(2024, 7, 28, 15, 0), amount: 45.00, type: "Online", status: "Paid" },
  { id: "pay6", customer: "Emily Client", physician: "Dr. Jones", date: new Date(2024, 7, 5, 16, 30), amount: 120.00, type: "Physical", status: "Failed" },
  { id: "pay7", customer: "David Booker", physician: "Dr. Smith", date: new Date(2024, 6, 30, 13, 0), amount: 75.00, type: "Online", status: "Paid" },
  { id: "pay8", customer: "Olivia User", physician: "Dr. Williams", date: new Date(2024, 7, 18, 10, 0), amount: 100.00, type: "Physical", status: "Paid" },
  { id: "pay9", customer: "James Guest", physician: "Dr. Brown", date: new Date(2024, 7, 22, 14, 45), amount: 90.00, type: "Physical", status: "Pending" },
  { id: "pay10", customer: "Sophia Repeat", physician: "Dr. Smith", date: new Date(2024, 7, 25, 11, 15), amount: 75.00, type: "Online", status: "Paid" },
];

const ITEMS_PER_PAGE = 6; // Number of cards per page

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case 'paid': return 'default'; // Use accent color defined in CSS
    case 'pending': return 'secondary'; // Use yellow-ish theme color
    case 'failed': return 'destructive';
    default: return 'outline';
  }
};

const getStatusBadgeClass = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'paid': return 'bg-accent text-accent-foreground'; // Use accent color
        case 'pending': return 'bg-yellow-400/20 text-yellow-700 border-yellow-400/50'; // Custom yellow for pending
        case 'failed': return 'bg-destructive text-destructive-foreground';
        default: return '';
    }
};


export default function PaymentManagementPage() {
   const [currentPage, setCurrentPage] = useState(1);

  const totalPayments = allPayments.length;
  const totalPages = Math.ceil(totalPayments / ITEMS_PER_PAGE);

  // Calculate the payments to display for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPayments = allPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
          <div className="flex gap-2">
             <Button variant="outline">
               <Filter className="mr-2 h-4 w-4" /> Filter
             </Button>
             <Button>
               <Download className="mr-2 h-4 w-4" /> Export Data
             </Button>
          </div>
       </div>


      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage payment records.</CardDescription>
        </CardHeader>
        <CardContent>
          {currentPayments.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPayments.map((payment) => (
                  <Card key={payment.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{formatCurrency(payment.amount)}</span>
                         <Badge
                           variant={getStatusBadgeVariant(payment.status)}
                           className={getStatusBadgeClass(payment.status)}
                         >
                            {payment.status}
                         </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center pt-1">
                         <User className="h-4 w-4 mr-1.5 text-muted-foreground" /> {payment.customer}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm pt-0 pb-4">
                       <div className="flex items-center text-muted-foreground">
                          <CreditCard className="h-4 w-4 mr-1.5 text-primary" /> Physician: {payment.physician}
                       </div>
                       <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1.5 text-primary" /> Date: {format(payment.date, 'PPP')}
                       </div>
                       <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1.5 text-primary" /> Time: {format(payment.date, 'p')}
                       </div>
                      <div className="flex items-center text-muted-foreground">
                         <Tag className="h-4 w-4 mr-1.5 text-primary" /> Type: <Badge variant="secondary" className="ml-1">{payment.type}</Badge>
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
                          <DropdownMenuItem disabled={payment.status !== 'Paid'}>Issue Refund</DropdownMenuItem>
                           <DropdownMenuItem disabled={payment.status !== 'Pending'}>Mark as Paid</DropdownMenuItem>
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
                  totalItems={totalPayments}
              />
            </>
          ) : (
             <p className="text-center text-muted-foreground py-8">No payments found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
