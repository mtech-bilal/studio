// src/app/admin/dashboard/page.tsx
"use client" // Required for charts and calendar interactions

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarCheck2, Link as LinkIcon, DollarSign, TrendingUp, PieChart as PieChartIcon, Calendar as CalendarIcon } from "lucide-react"; // Updated icons
import Link from "next/link";
import { GeneratedLinkCard } from "@/components/GeneratedLinkCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"; // Chart imports
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell } from "recharts"; // Recharts imports
import type { ChartConfig } from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar"; // Import Calendar
import { format } from 'date-fns'; // Import format from date-fns


// Mock Data (replace with actual data fetching)
const dashboardStats = [
  { title: "Total Appointments", value: "1,234", icon: CalendarCheck2, change: "+15.2%", changeColor: "text-emerald-600 dark:text-emerald-400" },
  { title: "Revenue This Month", value: "$5,678", icon: DollarSign, change: "+8.5%", changeColor: "text-emerald-600 dark:text-emerald-400" },
  { title: "New Patients (Month)", value: "89", icon: Users, change: "+5 this week", changeColor: "text-emerald-600 dark:text-emerald-400" },
];

const appointmentsData = [
  { month: "Jan", appointments: 186 },
  { month: "Feb", appointments: 205 },
  { month: "Mar", appointments: 237 },
  { month: "Apr", appointments: 173 },
  { month: "May", appointments: 209 },
  { month: "Jun", appointments: 214 },
  { month: "Jul", appointments: 255 },
];

const appointmentStatusData = [
    { status: "Completed", count: 850, fill: "var(--chart-1)" }, // Use chart CSS variables
    { status: "Scheduled", count: 300, fill: "var(--chart-2)" },
    { status: "Cancelled", count: 84, fill: "var(--chart-5)" }, // Use chart-5 for destructive-like color
];

// Mock upcoming appointment dates
const upcomingAppointmentDates: Date[] = [
    new Date(2024, 7, 15), // August 15, 2024 (Note: Month is 0-indexed)
    new Date(2024, 7, 18), // August 18, 2024
    new Date(2024, 7, 22), // August 22, 2024
    new Date(2024, 8, 5),  // September 5, 2024
    new Date(2024, 8, 10), // September 10, 2024
];


const chartConfig = {
  appointments: {
    label: "Appointments",
    color: "hsl(var(--chart-1))",
  },
  count: {
    label: "Count",
  },
  completed: {
     label: "Completed",
     color: "hsl(var(--chart-1))",
  },
  scheduled: {
      label: "Scheduled",
      color: "hsl(var(--chart-2))",
  },
    cancelled: {
        label: "Cancelled",
        color: "hsl(var(--chart-5))",
    },

} satisfies ChartConfig;


export default function AdminDashboard() {
  const genericBookingLink = "/book"; // The generic link
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Modifiers for react-day-picker to highlight appointment days
  const modifiers = {
     hasAppointment: upcomingAppointmentDates,
  };

  const modifiersStyles = {
     hasAppointment: {
       // Style for days with appointments (e.g., primary color dot or background)
       // Using a subtle background color
       backgroundColor: 'hsla(var(--primary) / 0.1)',
       borderRadius: '50%',
       fontWeight: 'bold',
       color: 'hsl(var(--primary))'
     }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
         <Button asChild size="sm">
            <Link href="/admin/create-link">
               <LinkIcon className="mr-2 h-4 w-4" /> Manage Booking Link
            </Link>
         </Button>
      </div>


      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeColor || 'text-muted-foreground'}`}>{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

       {/* Charts & Calendar Section */}
       <div className="grid gap-4 lg:grid-cols-3">
          {/* Calendar Section */}
          <Card className="lg:col-span-1 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" /> Upcoming Schedule
                </CardTitle>
                <CardDescription>View days with scheduled appointments.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-0 [&_button]:h-9 [&_button]:w-9"
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90", // Ensure selected day style is distinct
                  day_today: "bg-accent text-accent-foreground",
                  // Ensure modifier style overrides default hover if needed
                  day_hasAppointment: "relative", // Needed for potential pseudo-elements if using dots
                 }}
              />
            </CardContent>
            {selectedDate && upcomingAppointmentDates.some(d => d.toDateString() === selectedDate.toDateString()) && (
                 <CardContent className="pt-2 pb-4 px-4">
                    <p className="text-sm text-center text-primary font-medium">
                        Appointments scheduled on {format(selectedDate, 'PPP')}
                    </p>
                    {/* Here you could list appointments for the selected date */}
                 </CardContent>
            )}
            {selectedDate && !upcomingAppointmentDates.some(d => d.toDateString() === selectedDate.toDateString()) && (
                 <CardContent className="pt-2 pb-4 px-4">
                    <p className="text-sm text-center text-muted-foreground">
                        No appointments scheduled on {format(selectedDate, 'PPP')}
                    </p>
                 </CardContent>
            )}
          </Card>

          {/* Charts Section */}
           <div className="lg:col-span-2 grid gap-4 md:grid-cols-1"> {/* Nested grid for charts */}
              {/* Appointments Trend Chart */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <TrendingUp className="h-5 w-5 text-primary" /> Appointments Trend
                  </CardTitle>
                  <CardDescription>Monthly appointment volume over the year.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart
                      accessibilityLayer
                      data={appointmentsData}
                      margin={{ left: 12, right: 12, top: 5, bottom: 5 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Line
                        dataKey="appointments"
                        type="monotone"
                        stroke="var(--color-appointments)"
                        strokeWidth={2}
                        dot={true}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Appointment Status Chart */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" /> Appointment Status
                  </CardTitle>
                  <CardDescription>Breakdown of appointment statuses.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center pb-0">
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                     <PieChart accessibilityLayer >
                       <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" nameKey="status" hideLabel />} />
                       <Pie
                        data={appointmentStatusData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={2}
                        fill="var(--color-count)" // Base fill, overridden by Cell
                       >
                           {appointmentStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                           ))}
                       </Pie>
                        <ChartLegend
                          content={<ChartLegendContent nameKey="status" />}
                          verticalAlign="bottom"
                          align="center"
                          iconSize={10}
                        />
                     </PieChart>
                   </ChartContainer>
                </CardContent>
              </Card>
           </div>
       </div>


      {/* Generic Booking Link Section */}
       <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
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

    </div>
  );
}
