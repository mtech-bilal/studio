// src/app/admin/dashboard/page.tsx
"use client";

import React from 'react';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, XAxis, YAxis } from "recharts";
import { format } from 'date-fns';
import {
  Users,
  CalendarCheck2,
  DollarSign,
  ArrowUpRight,
  Link as LinkIcon,
  PlusCircle,
  Activity,
  TrendingUp,
  BarChartHorizontal,
  ListChecks
} from "lucide-react";

// Mock Data (replace with actual data fetching)
const kpiData = [
  { title: "Total Appointments", value: "1,234", change: "+15.2%", icon: CalendarCheck2, changeColor: "text-emerald-600 dark:text-emerald-400", link: "#appointments" },
  { title: "Revenue This Month", value: "$5,678", change: "+8.5%", icon: DollarSign, changeColor: "text-emerald-600 dark:text-emerald-400", link: "/admin/payments" },
  { title: "New Patients (Month)", value: "89", icon: Users, change: "+5 this week", changeColor: "text-emerald-600 dark:text-emerald-400", link: "/admin/customers" },
];

const upcomingAppointments = [
  { id: "appt1", patientName: "Sarah Visitor", physicianName: "Dr. Jones", time: new Date(2024, 7, 30, 10, 0), avatar: "https://picsum.photos/id/1011/100/100", initials: "SV", dataAiHint: "person face" },
  { id: "appt2", patientName: "Mike Frequent", physicianName: "Dr. Smith", time: new Date(2024, 7, 30, 11, 30), avatar: "https://picsum.photos/id/1025/100/100", initials: "MF", dataAiHint: "person professional" },
  { id: "appt3", patientName: "Linda New", physicianName: "Dr. Williams", time: new Date(2024, 7, 31, 9, 0), avatar: "https://picsum.photos/id/1012/100/100", initials: "LN", dataAiHint: "woman portrait" },
  { id: "appt4", patientName: "George Regular", physicianName: "Dr. Brown", time: new Date(2024, 7, 31, 14, 0), avatar: "https://picsum.photos/id/1005/100/100", initials: "GR", dataAiHint: "man professional" },
];

const recentActivity = [
  { id: "act1", type: "New Booking", description: "John Patient booked with Dr. Smith", time: "2h ago", icon: CalendarCheck2 },
  { id: "act2", type: "Payment Received", description: "$120 from Sarah Visitor", time: "4h ago", icon: DollarSign },
  { id: "act3", type: "Physician Added", description: "Dr. Chen (Neurologist)", time: "1d ago", icon: PlusCircle },
  { id: "act4", type: "Booking Cancelled", description: "Mike Frequent cancelled", time: "2d ago", icon: CalendarCheck2, variant: "destructive" as const },
];

const appointmentsTrendData = [
  { month: "Jan", appointments: 186 }, { month: "Feb", appointments: 205 }, { month: "Mar", appointments: 237 },
  { month: "Apr", appointments: 173 }, { month: "May", appointments: 209 }, { month: "Jun", appointments: 214 },
  { month: "Jul", appointments: 255 }, { month: "Aug", appointments: 280 }, // Added Aug
];

const appointmentStatusData = [
  { status: "Completed", count: 850, fill: "var(--chart-1)" },
  { status: "Scheduled", count: 300, fill: "var(--chart-2)" },
  { status: "Cancelled", count: 84, fill: "var(--chart-5)" },
];

const appointmentsTrendConfig = {
  appointments: { label: "Appointments", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const appointmentStatusConfig = {
  count: { label: "Count" },
  Completed: { label: "Completed", color: "hsl(var(--chart-1))" },
  Scheduled: { label: "Scheduled", color: "hsl(var(--chart-2))" },
  Cancelled: { label: "Cancelled", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


export default function AdminDashboardRedesign() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Alice Admin!</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
             <Link href="/admin/physicians/page.tsx">
               <PlusCircle className="mr-2 h-4 w-4" /> Add Physician
             </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/create-link">
              <LinkIcon className="mr-2 h-4 w-4" /> Manage Booking Link
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.changeColor || 'text-muted-foreground'} flex items-center`}>
                <ArrowUpRight className="h-3 w-3 mr-1" /> {kpi.change}
              </p>
            </CardContent>
            {kpi.link && (
                <CardFooter className="pt-0 pb-3 px-6">
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                       <Link href={kpi.link}>View Details</Link>
                    </Button>
                </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Appointments & Trend) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck2 className="h-5 w-5 text-primary" /> Upcoming Appointments
              </CardTitle>
              <CardDescription>Your next few scheduled appointments.</CardDescription>
            </CardHeader>
            <CardContent>
               {upcomingAppointments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Physician</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.map((appt) => (
                        <TableRow key={appt.id}>
                          <TableCell className="font-medium">{format(appt.time, 'p')}<br/> <span className="text-xs text-muted-foreground">{format(appt.time, 'MMM d')}</span></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                               <Avatar className="h-8 w-8">
                                 <AvatarImage src={appt.avatar} alt={appt.patientName} data-ai-hint={appt.dataAiHint}/>
                                 <AvatarFallback>{appt.initials}</AvatarFallback>
                               </Avatar>
                               <span>{appt.patientName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{appt.physicianName}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               ) : (
                 <p className="text-center text-muted-foreground py-4">No upcoming appointments.</p>
               )}
            </CardContent>
             <CardFooter className="justify-end">
                <Button variant="outline" size="sm" asChild>
                   <Link href="#all-appointments">View All</Link>
                </Button>
             </CardFooter>
          </Card>

          {/* Appointments Trend Chart */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Appointments Trend
              </CardTitle>
              <CardDescription>Monthly appointment volume.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={appointmentsTrendConfig} className="h-[250px] w-full">
                <LineChart accessibilityLayer data={appointmentsTrendData} margin={{ left: -20, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Line dataKey="appointments" type="monotone" stroke="var(--color-appointments)" strokeWidth={2} dot={true} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Status & Activity) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Appointment Status Chart */}
           <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" /> Appointment Status
                  </CardTitle>
                  <CardDescription>Breakdown of recent statuses.</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                   <ChartContainer config={appointmentStatusConfig} className="h-[150px] w-full"> {/* Reduced height */}
                      <BarChart
                        accessibilityLayer
                        data={appointmentStatusData}
                        layout="vertical"
                        margin={{ left: 10, right: 10, top: 0, bottom: 0 }} // Adjust margins
                      >
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="status"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          width={80}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" nameKey="status" hideLabel />}
                        />
                        <Bar dataKey="count" layout="vertical" radius={4} barSize={20}> {/* Adjusted bar size */}
                           {appointmentStatusData.map((entry) => (
                              <Cell key={`cell-${entry.status}`} fill={entry.fill} name={entry.status} />
                           ))}
                         </Bar>
                      </BarChart>
                   </ChartContainer>
                </CardContent>
              </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Recent Activity
              </CardTitle>
              <CardDescription>Latest updates in the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${activity.variant === 'destructive' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                     <activity.icon className={`h-4 w-4 ${activity.variant === 'destructive' ? 'text-destructive' : 'text-primary'}`} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.type}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </CardContent>
             <CardFooter>
                 <Button variant="outline" size="sm" className="w-full">View Full Activity Log</Button>
             </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Note: The GeneratedLinkCard component is no longer directly used on the dashboard page
// but kept in the project for the /admin/create-link page.
// Removed the Calendar component import and usage as it's replaced by the upcoming appointments list.
// Replaced BarChartHorizontal icon with ListChecks for Appointment Status.
