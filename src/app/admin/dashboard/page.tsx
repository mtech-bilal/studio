// src/app/admin/dashboard/page.tsx
"use client" // Required for charts

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarCheck2, Link as LinkIcon, DollarSign, TrendingUp, PieChart as PieChartIcon } from "lucide-react"; // Updated icons
import Link from "next/link";
import { GeneratedLinkCard } from "@/components/GeneratedLinkCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"; // Chart imports
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell } from "recharts"; // Recharts imports
import type { ChartConfig } from "@/components/ui/chart";


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
          <Card key={index}>
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

       {/* Charts Section */}
       <div className="grid gap-4 md:grid-cols-2">
          {/* Appointments Trend Chart */}
          <Card>
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
          <Card>
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

    </div>
  );
}
