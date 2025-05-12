import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, BarChart2, Users, CalendarCheck2 } from "lucide-react";
import Link from "next/link";
import { GeneratedLinkCard } from "@/components/GeneratedLinkCard"; // Import the component


// Mock Data (replace with actual data fetching)
const dashboardStats = [
  { title: "Total Appointments", value: "1,234", icon: CalendarCheck2, change: "+15.2%" },
  { title: "Active Links", value: "12", icon: Copy, change: "+2" },
  { title: "New Patients", value: "89", icon: Users, change: "+5 this week" },
];

const recentLinks = [
 { physicianId: "dr-smith", physicianName: "Dr. John Smith - Cardiologist", link: "/book/dr-smith", createdAt: "2024-07-28", status: "Active" },
 { physicianId: "dr-jones", physicianName: "Dr. Sarah Jones - Dermatologist", link: "/book/dr-jones", createdAt: "2024-07-27", status: "Active" },
 { physicianId: "dr-williams", physicianName: "Dr. Robert Williams - Pediatrician", link: "/book/dr-williams", createdAt: "2024-07-26", status: "Inactive" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
         <Button asChild>
            <Link href="/admin/create-link">Create New Link</Link>
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

      {/* Generated Links Section */}
       <Card>
         <CardHeader>
           <CardTitle>Recently Generated Links</CardTitle>
           <CardDescription>Manage and view your booking links.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           {recentLinks.slice(0, 2).map((link) => ( // Display first 2 links as cards
              <GeneratedLinkCard key={link.physicianId} physicianName={link.physicianName} link={link.link} />
           ))}
           {recentLinks.length > 2 && (
              <div className="text-center mt-4">
                 <Button variant="outline">View All Links</Button>
              </div>
           )}
           {recentLinks.length === 0 && (
             <p className="text-muted-foreground text-center">No links generated yet.</p>
           )}
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
