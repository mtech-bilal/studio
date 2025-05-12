// src/app/admin/roles/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, PlusCircle } from "lucide-react";

// Mock data - replace with actual data structure and fetching
const roles = [
  { id: "admin", name: "Admin", description: "Full access to all system features.", permissions: ["manage_users", "manage_physicians", "manage_bookings", "manage_settings", "view_reports"] },
  { id: "staff", name: "Staff", description: "Access to booking management and basic reporting.", permissions: ["manage_bookings", "view_reports"] },
  { id: "physician", name: "Physician", description: "Access to own schedule and patient info.", permissions: ["view_schedule", "manage_own_bookings"] },
];

const allPermissions = [
    { id: "manage_users", label: "Manage Users" },
    { id: "manage_physicians", label: "Manage Physicians" },
    { id: "manage_bookings", label: "Manage Bookings" },
    { id: "manage_settings", label: "Manage Settings" },
    { id: "view_reports", label: "View Reports" },
    { id: "view_schedule", label: "View Schedule" },
    { id: "manage_own_bookings", label: "Manage Own Bookings" },
];


export default function RoleManagementPage() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <Button>
           <PlusCircle className="mr-2 h-4 w-4" /> Add New Role
         </Button>
       </div>


      <Card>
        <CardHeader>
          <CardTitle>Manage Roles</CardTitle>
          <CardDescription>Define roles and assign permissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {roles.map((role) => (
            <Card key={role.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 p-4 flex flex-row justify-between items-center">
                 <div>
                   <CardTitle className="text-xl flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary"/> {role.name}
                   </CardTitle>
                   <CardDescription className="pt-1">{role.description}</CardDescription>
                 </div>
                 <Button variant="outline" size="sm">Edit Role</Button>
              </CardHeader>
              <CardContent className="p-4">
                 <h4 className="font-medium mb-2">Permissions:</h4>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   {allPermissions.map((permission) => (
                     <div key={permission.id} className="flex items-center space-x-2">
                       <Checkbox
                         id={`${role.id}-${permission.id}`}
                         checked={role.permissions.includes(permission.id)}
                         disabled // Make this interactive in a real implementation
                       />
                       <label
                         htmlFor={`${role.id}-${permission.id}`}
                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                       >
                         {permission.label}
                       </label>
                     </div>
                   ))}
                 </div>
              </CardContent>
            </Card>
          ))}

        </CardContent>
      </Card>
    </div>
  );
}
