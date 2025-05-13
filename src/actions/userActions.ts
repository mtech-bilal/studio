// src/actions/userActions.ts
'use server';

import type { Role } from './roleActions'; // Assuming Role type is defined here

export interface User {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
  _type?: 'user';
  name: string;
  email: string;
  role: string; // Role name like 'admin', 'physician'
  status: "Active" | "Inactive";
  avatarUrl?: string; // Optional
  // Password should not be part of the User object returned to client, except maybe a hash for internal use
}

export interface UserInputData {
  name: string;
  email: string;
  role: string; // Role name
  password?: string; // For creation, make optional for updates if password change is separate
  status?: "Active" | "Inactive";
  avatarUrl?: string;
}

// Mock data store for users
let mockUsers: User[] = [
  { _id: "user1", name: "Alice Administrator", email: "admin@example.com", role: "admin", status: "Active", _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'user', avatarUrl: 'https://picsum.photos/seed/user1/200' },
  { _id: "user2", name: "Dr. Bob Physician", email: "physician@example.com", role: "physician", status: "Active", _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'user', avatarUrl: 'https://picsum.photos/seed/user2/200' },
  { _id: "user3", name: "Charlie Customer", email: "customer@example.com", role: "customer", status: "Active", _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'user', avatarUrl: 'https://picsum.photos/seed/user3/200' },
  { _id: "user4", name: "Diana Disabled", email: "diana@example.com", role: "physician", status: "Inactive", _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'user', avatarUrl: 'https://picsum.photos/seed/user4/200' },
];


export async function fetchMockUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
  return JSON.parse(JSON.stringify(mockUsers)); // Return a deep copy
}

export async function createMockUser(data: UserInputData): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (mockUsers.some(u => u.email === data.email)) {
    throw new Error(`User with email "${data.email}" already exists.`);
  }
  const newUser: User = {
    _id: `user${Date.now()}`,
    ...data,
    status: data.status || "Active", // Default to active
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: '1',
    _type: 'user',
  };
  // In a real app, hash the password here if data.password is provided
  mockUsers.push(newUser);
  const { password, ...userWithoutPassword } = newUser; // Don't return password
  return { ...userWithoutPassword };
}

export async function updateMockUser(id: string, data: Partial<UserInputData>): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const userIndex = mockUsers.findIndex(u => u._id === id);
  if (userIndex === -1) {
    return null;
  }
  // Prevent changing email if it causes a conflict with another user
  if (data.email && data.email !== mockUsers[userIndex].email && mockUsers.some(u => u.email === data.email && u._id !== id)) {
    throw new Error(`Another user with email "${data.email}" already exists.`);
  }

  mockUsers[userIndex] = { ...mockUsers[userIndex], ...data, _updatedAt: new Date().toISOString() };
  // In a real app, handle password update separately or hash if data.password is provided
  const { password, ...updatedUserWithoutPassword } = mockUsers[userIndex];
  return { ...updatedUserWithoutPassword };
}

export async function deleteMockUser(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockUsers = mockUsers.filter(u => u._id !== id);
}
