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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell as RechartsCell, RadialBarChart, RadialBar, PolarGrid } from "recharts";
import { format } from 'date-fns';
import {
  Bed,
  Activity,
  Users,
  CarFront,
  CalendarCheck2,
  Settings2,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Star
} from "lucide-react";

// Mock Data for Doctris-like Dashboard

const kpiData = [
  { title: "Patients", value: "558", icon: Bed, change: "+2.5%", trend: "up" },
  { title: "Avg. Costs", value: "$2164", icon: Activity, change: "-1.0%", trend: "down" },
  { title: "Staff Members", value: "112", icon: Users, change: "+5", trend: "up" },
  { title: "Vehicles", value: "16", icon: CarFront, change: "+1", trend: "up" },
  { title: "Appointment", value: "220", icon: CalendarCheck2, change: "+12 today", trend: "up" },
  { title: "Operations", value: "10", icon: Settings2, change: "Normal", trend: "neutral" },
];

const genderVisitData = [
  { month: "Jan", Male: 280, Female: 200, Children: 150 },
  { month: "Feb", Male: 190, Female: 350, Children: 120 },
  { month: "Mar", Male: 400, Female: 250, Children: 180 },
  { month: "Apr", Male: 310, Female: 180, Children: 200 },
  { month: "May", Male: 250, Female: 400, Children: 160 },
  { month: "Jun", Male: 300, Female: 320, Children: 140 },
  { month: "Jul", Male: 350, Female: 280, Children: 190 },
  { month: "Aug", Male: 420, Female: 220, Children: 170 },
  { month: "Sep", Male: 330, Female: 300, Children: 150 },
  { month: "Oct", Male: 280, Female: 380, Children: 130 },
  { month: "Nov", Male: 450, Female: 260, Children: 160 },
  { month: "Dec", Male: 380, Female: 290, Children: 180 },
];

const genderVisitConfig = {
  Male: { label: "Male", color: "hsl(var(--chart-1))" },
  Female: { label: "Female", color: "hsl(var(--chart-2))" },
  Children: { label: "Children", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

const departmentData = [
    { name: 'Orthopedic', value: 70, fill: 'hsl(var(--chart-1))' },
    { name: 'Dental', value: 55, fill: 'hsl(var(--chart-2))' },
    { name: 'Cardiology', value: 45, fill: 'hsl(var(--chart-3))' },
    { name: 'Neurology', value: 40, fill: 'hsl(var(--chart-4))' },
    { name: 'General', value: 39, fill: 'hsl(var(--chart-5))' },
];
const totalPatientsByDept = departmentData.reduce((sum, item) => sum + item.value, 0);

const departmentConfig = departmentData.reduce((acc, entry) => {
    acc[entry.name] = { label: entry.name, color: entry.fill };
    return acc;
}, {} as ChartConfig);


const latestAppointments = [
  { id: "appt1", patientName: "Calvin Carlo", avatar: "https://picsum.photos/id/1005/100/100", dataAiHint: "man portrait", bookingOn: "13th Sep, 2023", status: "Pending" },
  { id: "appt2", patientName: "Cristino Murphy", avatar: "https://picsum.photos/id/1011/100/100", dataAiHint: "person face", bookingOn: "29th Nov, 2023", status: "Pending", online: true },
  { id: "appt3", patientName: "Hey Christopher", avatar: "https://picsum.photos/id/1025/100/100", dataAiHint: "person professional", bookingOn: "29th Nov, 2023 - 10:10AM", status: "Pending" },
  { id: "appt4", patientName: "Alexa Melvin", avatar: "https://picsum.photos/id/1012/100/100", dataAiHint: "woman portrait", bookingOn: "1st Dec, 2023", status: "Pending" },
];

const patientReviews = [
  { id: "rev1", patientName: "Dr. Calvin Carlo", specialty: "Orthopedic", rating: 4, reviewText: "Great experience, very knowledgeable doctor.", avatar: "https://picsum.photos/id/1005/100/100", dataAiHint: "man professional", patientsCount: 150 },
  { id: "rev2", patientName: "Dr. Cristino Murphy", specialty: "Gynecology", rating: 5, reviewText: "Excellent care and attention to detail.", avatar: "https://picsum.photos/id/1011/100/100", dataAiHint: "person face", patientsCount: 205 },
  { id: "rev3", patientName: "Dr. Alia Reddy", specialty: "Psychotherapy", rating: 3, reviewText: "Good, but waiting time was a bit long.", avatar: "https://picsum.photos/id/1013/100/100", dataAiHint: "woman professional", patientsCount: 180 },
];


export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          {/* No subtitle in Doctris for dashboard, or actions here */}
        </div>
         {/* Doctris has a top bar for search/notifications/profile, handled by AdminLayout or a new Topbar component */}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-3 rounded-md bg-primary/10 text-primary`}>
                    <kpi.icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="text-xl font-semibold text-foreground">{kpi.value}</p>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Charts) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patients visit by Gender Chart */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Patients visit by Gender</CardTitle>
              {/* Doctris has a year selector here, can be added later */}
            </CardHeader>
            <CardContent>
              <ChartContainer config={genderVisitConfig} className="h-[300px] w-full">
                <BarChart data={genderVisitData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} allowDecimals={false} />
                  <RechartsTooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Legend content={({ payload }) => (
                    <div className="flex justify-center gap-4 mt-2">
                      {payload?.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-xs text-muted-foreground">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )} />
                  <Bar dataKey="Male" fill="var(--color-Male)" radius={[4, 4, 0, 0]} barSize={10} />
                  <Bar dataKey="Female" fill="var(--color-Female)" radius={[4, 4, 0, 0]} barSize={10} />
                  <Bar dataKey="Children" fill="var(--color-Children)" radius={[4, 4, 0, 0]} barSize={10} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Department Chart) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Patients by Department</CardTitle>
               {/* Doctris has a time filter (Today, Month, Year) */}
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[300px]">
              <ChartContainer config={departmentConfig} className="mx-auto aspect-square max-h-[250px]">
                <RadialBarChart
                  data={departmentData}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="40%"
                  outerRadius="80%"
                  barSize={12}
                  cy="50%"
                >
                  <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-muted last:fill-background" />
                  <RadialBar dataKey="value" background cornerRadius={5}/>
                  <RechartsTooltip
                     cursor={{fill: 'hsl(var(--muted))', opacity: 0.5}}
                     content={
                       <ChartTooltipContent
                         hideLabel
                         formatter={(value, name, props) => (
                           <div className="flex items-center gap-2">
                             <div
                               className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                               style={{ backgroundColor: props.payload?.fill }}
                             />
                             {props.payload?.name}: {value}
                           </div>
                         )}
                       />
                     }
                   />
                </RadialBarChart>
              </ChartContainer>
               <p className="text-center text-2xl font-semibold text-foreground mt-[-1.5em]">{totalPatientsByDept}</p>
               <p className="text-center text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row Grids */}
      <div className="grid gap-6 lg:grid-cols-3">
          {/* Latest Appointments */}
          <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Latest Appointment</CardTitle>
              <Button variant="ghost" size="sm" asChild><Link href="#">55 Patients</Link></Button>
            </CardHeader>
            <CardContent className="p-0">
               {latestAppointments.length > 0 ? (
                  <Table>
                    <TableBody>
                      {latestAppointments.map((appt) => (
                        <TableRow key={appt.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                               <Avatar className="h-10 w-10">
                                 <AvatarImage src={appt.avatar} alt={appt.patientName} data-ai-hint={appt.dataAiHint} />
                                 <AvatarFallback>{appt.patientName.substring(0,2).toUpperCase()}</AvatarFallback>
                               </Avatar>
                               <div>
                                   <p className="font-medium text-foreground">{appt.patientName} {appt.online && <Badge variant="secondary" className="ml-1 text-xs">Online</Badge>}</p>
                                   <p className="text-xs text-muted-foreground">Booking on {appt.bookingOn}</p>
                               </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                                <Button variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-500/10 h-8 w-8">
                                    <CheckCircle className="h-4 w-4"/>
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 h-8 w-8">
                                    <XCircle className="h-4 w-4"/>
                                </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               ) : (
                 <p className="text-center text-muted-foreground py-4 px-6">No upcoming appointments.</p>
               )}
            </CardContent>
          </Card>

          {/* Patients Reviews */}
          <Card className="lg:col-span-1 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Patients Reviews</CardTitle>
               {/* Doctris has a filter here (New, Oldest) */}
            </CardHeader>
            <CardContent className="space-y-4">
              {patientReviews.slice(0,2).map((review) => ( // Show only 2 for brevity in this column
                <div key={review.id} className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                     <AvatarImage src={review.avatar} alt={review.patientName} data-ai-hint={review.dataAiHint} />
                     <AvatarFallback>{review.patientName.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-foreground">{review.patientName}</p>
                            <p className="text-xs text-muted-foreground">{review.specialty}</p>
                        </div>
                        <div className="flex items-center text-xs text-amber-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'fill-muted stroke-muted-foreground'}`} />
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{review.reviewText}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
