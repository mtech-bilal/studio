// src/app/admin/payments/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Filter, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

// Mock data - replace with actual data fetching
const payments = [
  { id: "pay1", customer: "John Patient", physician: "Dr. Smith", date: new Date(2024, 6, 15, 10, 30), amount: 75.00, type: "Online", status: "Paid" },
  { id: "pay2", customer: "Sarah Visitor", physician: "Dr. Jones", date: new Date(2024, 7, 1, 14, 0), amount: 120.00, type: "Physical", status: "Paid" },
  { id: "pay3", customer: "Mike Frequent", physician: "Dr. Smith", date: new Date(2024, 7, 20, 9, 0), amount: 75.00, type: "Online", status: "Pending" },
  { id: "pay4", customer: "Anna Lee", physician: "Dr. Williams", date: new Date(2024, 7, 21, 11, 0), amount: 90.00, type: "Physical", status: "Paid" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};


export default function PaymentManagementPage() {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Physician</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.customer}</TableCell>
                  <TableCell>{payment.physician}</TableCell>
                  <TableCell>{format(payment.date, 'PPP p')}</TableCell>
                   <TableCell>
                      <Badge variant="secondary">{payment.type}</Badge>
                   </TableCell>
                  <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "Paid" ? "default" : "outline"} className={payment.status === "Paid" ? 'bg-accent text-accent-foreground' : 'bg-yellow-100 text-yellow-800 border-yellow-300'}>
                       {payment.status}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Issue Refund</DropdownMenuItem>
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
