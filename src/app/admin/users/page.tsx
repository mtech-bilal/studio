// src/app/admin/users/page.tsx
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { UserPlus, MoreHorizontal, Mail, Shield, UserCheck, UserX, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationControls } from '@/components/PaginationControls';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMockUsers, updateMockUser, deleteMockUser, type User } from '@/actions/userActions';

const ITEMS_PER_PAGE = 6;

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | false>(false); // Store ID of user being processed or false
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const usersList = await fetchMockUsers();
      usersList.sort((a,b) => (a._createdAt && b._createdAt) ? new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime() : a.name.localeCompare(b.name));
      setUsers(usersList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({ title: "Error", description: "Could not fetch users.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);


  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
  const currentUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const toggleUserStatus = async (user: User) => {
    setIsProcessing(user._id);
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    startTransition(async () => {
      try {
        await updateMockUser(user._id, { status: newStatus });
        toast({ title: "Status Updated", description: `${user.name}'s status changed to ${newStatus}.` });
        await loadUsers(); // Refresh list
      } catch (error) {
        toast({ title: "Error", description: "Could not update user status.", variant: "destructive" });
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
     if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) return;
     setIsProcessing(userId);
     startTransition(async () => {
        try {
            await deleteMockUser(userId);
            toast({ title: "User Deleted", description: `${userName} has been removed.` });
            const newList = await fetchMockUsers();
            newList.sort((a,b) => (a._createdAt && b._createdAt) ? new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime() : a.name.localeCompare(b.name));
            setUsers(newList);
            
            const newTotalPages = Math.ceil(newList.length / ITEMS_PER_PAGE);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            } else if (newList.length === 0) {
                setCurrentPage(1);
            }

        } catch (error) {
            toast({ title: "Error", description: "Could not delete user.", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
     });
  };

  if (isLoading && users.length === 0) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"> <Skeleton className="h-9 w-1/3" /> <Skeleton className="h-10 w-36" /> </div>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-1/2 mt-1" /></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                        <Card key={i} className="p-4 space-y-3"><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-3/4" /></div><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-8 w-full mt-2" /></Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
         <Button asChild>
           <Link href="/admin/users/add">
             <UserPlus className="mr-2 h-4 w-4" /> Add New User
           </Link>
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
                   <Card key={user._id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
                     <CardHeader className="pb-3">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatarUrl || `https://picsum.photos/seed/${user._id}/100`} alt={user.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                           <CardTitle className="text-lg">{user.name}</CardTitle>
                         </div>
                           <Badge
                              variant={user.status === "Active" ? "default" : "outline"}
                              className={`${user.status === "Active" ? 'bg-accent text-accent-foreground' : 'border-dashed text-muted-foreground'} capitalize`}
                            >
                              {user.status === "Active" ? <UserCheck className="h-3 w-3 mr-1"/> : <UserX className="h-3 w-3 mr-1"/>}
                              {user.status}
                           </Badge>
                       </div>
                       <CardDescription className="flex items-center pt-2">
                          <Mail className="h-4 w-4 mr-1.5 text-muted-foreground" /> {user.email}
                       </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-2 text-sm pt-0 pb-4">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-1.5 text-primary" />
                          Role: <span className="font-medium ml-1 capitalize">{user.role}</span>
                       </div>
                     </CardContent>
                     <CardFooter className="flex justify-end border-t pt-3 pb-3 px-4">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button aria-haspopup="true" size="sm" variant="ghost" disabled={!!isProcessing}>
                             <MoreHorizontal className="h-4 w-4" />
                             <span className="sr-only">Actions</span>
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem asChild>
                             <Link href={`/admin/users/edit/${user._id}`}>
                               <Edit className="mr-2 h-4 w-4" /> Edit User
                             </Link>
                           </DropdownMenuItem>
                           {/* Change Role might be part of Edit User page */}
                           {/* <DropdownMenuItem disabled><Shield className="mr-2 h-4 w-4" /> Change Role</DropdownMenuItem> */}
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                             onClick={() => toggleUserStatus(user)}
                             className={user.status === "Active" ? "text-orange-600 focus:text-orange-700 focus:bg-orange-100" : "text-green-600 focus:text-green-700 focus:bg-green-100"}
                             disabled={isProcessing === user._id}
                           >
                              {user.status === "Active" ? ( <UserX className="mr-2 h-4 w-4" /> ) : ( <UserCheck className="mr-2 h-4 w-4" /> )}
                              {user.status === "Active" ? "Disable" : "Enable"} User
                           </DropdownMenuItem>
                           <DropdownMenuItem
                             className="text-destructive focus:text-destructive focus:bg-destructive/10"
                             onClick={() => handleDeleteUser(user._id, user.name)}
                             disabled={isProcessing === user._id}
                           >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
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
             <p className="text-center text-muted-foreground py-8">{isLoading ? 'Loading...' : 'No users found. Add one to get started.'}</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
