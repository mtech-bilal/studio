// src/app/admin/dashboard/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, BarChart2, Users, CalendarCheck2, Link as LinkIcon } from "lucide-react"; // Added LinkIcon
import Link from "next/link";
import { GeneratedLinkCard } from "@/components/GeneratedLinkCard"; // Import the component


// Mock Data (replace with actual data fetching)
const dashboardStats = [
  { title: "Total Appointments", value: "1,234", icon: CalendarCheck2, change: "+15.2%" },
  { title: "Active Physicians", value: "4", icon: Users , change: "+1" }, // Changed from Active Links
  { title: "New Patients", value: "89", icon: Users, change: "+5 this week" },
];

// Removed recentLinks mock data as we show the generic link now

export default function AdminDashboard() {
  const genericBookingLink = "/book"; // The generic link

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
         <Button asChild>
            <Link href="/admin/create-link">Manage Booking Link</Link>
         </Button>
      </div>


      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generic Booking Link Section */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" /> Generic Booking Link
           </CardTitle>
           <CardDescription>Share this link for customers to book appointments.</CardDescription>
         </CardHeader>
         <CardContent>
            <GeneratedLinkCard physicianName="General Booking Link" link={genericBookingLink} />
         </CardContent>
       </Card>

      {/* Placeholder for more complex data/charts */}
      <Card>
         <CardHeader>
           <CardTitle>Appointment Overview</CardTitle>
           <CardDescription>Visual representation of appointments (placeholder).</CardDescription>
         </CardHeader>
         <CardContent className="flex items-center justify-center h-64 bg-secondary rounded-md">
           <BarChart2 className="h-16 w-16 text-muted-foreground" />
           <p className="ml-4 text-muted-foreground">Chart data will be displayed here.</p>
         </CardContent>
      </Card>

    </div>
  );
}
