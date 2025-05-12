// src/app/admin/users/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserPlus, MoreHorizontal, Mail, Shield, UserCheck, UserX, Edit } from "lucide-react";
import { PaginationControls } from '@/components/PaginationControls'; // Import pagination

// Mock data structure - replace with actual data fetching
interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Role name
  status: "Active" | "Inactive";
}

const allUsers: User[] = [
  { id: "user1", name: "Alice Admin", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "user2", name: "Bob Staff", email: "bob@example.com", role: "Staff", status: "Active" },
  { id: "user3", name: "Charlie Disabled", email: "charlie@example.com", role: "Staff", status: "Inactive" },
  { id: "user4", name: "Diana Doctor", email: "diana.d@mail.com", role: "Physician", status: "Active" },
  { id: "user5", name: "Ethan Editor", email: "ethan.e@web.dev", role: "Staff", status: "Active" },
  { id: "user6", name: "Fiona Finance", email: "fiona.f@post.co", role: "Staff", status: "Active" },
  { id: "user7", name: "George Gone", email: "george.g@provider.com", role: "Physician", status: "Inactive" },
  { id: "user8", name: "Hannah Helper", email: "hannah.h@mail.com", role: "Staff", status: "Active" },
  { id: "user9", name: "Ian Inactive", email: "ian.i@service.net", role: "Admin", status: "Inactive" },
  { id: "user10", name: "Julia Jones", email: "julia.j@guest.org", role: "Physician", status: "Active" },
];

const ITEMS_PER_PAGE = 6; // Number of cards per page

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(allUsers);
  const [currentPage, setCurrentPage] = useState(1);
  // Add state for dialogs (Add/Edit User) if needed later

  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  // Calculate the users to display for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ));
  };

  // Placeholder for Add/Edit functionality
  const handleAddUser = () => { console.log("Add User clicked"); /* Open Add User Dialog */ };
  const handleEditUser = (user: User) => { console.log("Edit User:", user); /* Open Edit User Dialog */ };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
         <Button onClick={handleAddUser}>
           <UserPlus className="mr-2 h-4 w-4" /> Add New User
         </Button>
       </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage registered users and their roles.</CardDescription>
        </CardHeader>
        <CardContent>
           {currentUsers.length > 0 ? (
            <>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {currentUsers.map((user) => (
                   <Card key={user.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
                     <CardHeader className="pb-3">
                       <CardTitle className="text-lg flex items-center justify-between">
                          <span>{user.name}</span>
                           <Badge
                              variant={user.status === "Active" ? "default" : "outline"}
                              className={user.status === "Active" ? 'bg-accent text-accent-foreground' : 'border-dashed'}
                            >
                              {user.status === "Active" ? <UserCheck className="h-3 w-3 mr-1"/> : <UserX className="h-3 w-3 mr-1"/>}
                              {user.status}
                           </Badge>
                       </CardTitle>
                       <CardDescription className="flex items-center pt-1">
                          <Mail className="h-4 w-4 mr-1.5 text-muted-foreground" /> {user.email}
                       </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-2 text-sm pt-0 pb-4">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-1.5 text-primary" />
                          Role: <span className="font-medium ml-1">{user.role}</span>
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
                           <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit User
                           </DropdownMenuItem>
                           {/* Add Change Role functionality later */}
                           <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" /> Change Role
                            </DropdownMenuItem>
                           <DropdownMenuItem
                             onClick={() => toggleUserStatus(user.id)}
                             className={user.status === "Active" ? "text-destructive focus:text-destructive focus:bg-destructive/10" : "text-accent focus:text-accent focus:bg-accent/10"}
                           >
                              {user.status === "Active" ? (
                                 <UserX className="mr-2 h-4 w-4" />
                              ) : (
                                 <UserCheck className="mr-2 h-4 w-4" />
                              )}
                              {user.status === "Active" ? "Disable" : "Enable"} User
                           </DropdownMenuItem>
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
                  totalItems={totalUsers}
                />
            </>
           ) : (
             <p className="text-center text-muted-foreground py-8">No users found.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
