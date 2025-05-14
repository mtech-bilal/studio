// src/actions/userActions.ts
'use server';

import { getClient } from '@/sanity/client';
import type { SanityDocument, Slug, SanityReference } from 'next-sanity';
import type { Role } from './roleActions';
import { revalidatePath } from 'next/cache';
import type { AuthUser } from '@/hooks/useAuth'; // Corrected import for AuthUser


export interface User extends SanityDocument {
  _id: string;
  _type: 'user';
  name: string;
  email: string;
  role: SanityReference & { resolved?: Role }; // Store reference, can resolve to full Role object
  status: "Active" | "Inactive";
  avatarUrl?: string;
  password?: string; // Only for creation/update from admin, NOT typically fetched or stored long-term plain text
}

export interface UserSanityDocument extends Omit<User, 'role' | '_createdAt' | '_updatedAt' | '_rev' | '_type'> {
  _id: string;
  _type: 'user';
  _createdAt: string;
  _updatedAt: string;
  name: string;
  email: string;
  role: {
    _ref: string;
    _type: 'reference';
    // These are typically not directly on the reference but resolved in queries
    // resolvedName?: string; 
    // resolvedTitle?: string;
  };
  status: "Active" | "Inactive";
  avatarUrl?: string;
  password?: string; 
}


export interface UserInputData {
  name: string;
  email: string;
  roleId: string; // ID of the role document
  password?: string; // For creation/update by admin. NOT SECURE FOR PRODUCTION THIS WAY.
  status?: "Active" | "Inactive";
  avatarUrl?: string;
}

export async function fetchUsers(): Promise<User[]> {
  const client = getClient();
  // Fetch users and their referenced role's name (slug) and title
  const query = `*[_type == "user"]{
    ...,
    "role": role->{_id, _type, name, title} // Resolve role reference, ensure _type is fetched for reference
  } | order(_createdAt desc)`;
  try {
    const users = await client.fetch<User[]>(query);
    // Transform role to include resolved details correctly
    return users.map(u => ({
        ...u,
        // Ensure the role object structure matches the User interface, including _ref
        role: u.role?.resolved?._id ? { 
            _type: 'reference', 
            _ref: u.role.resolved._id, 
            resolved: u.role.resolved 
        } : undefined
    }));
  } catch (error) {
    console.error("Error fetching users from Sanity:", error);
    return [];
  }
}

export async function fetchUserById(userId: string): Promise<User | null> {
  const client = getClient();
  const query = `*[_type == "user" && _id == $userId][0]{
    ...,
    "role": role->{_id, _type, name, title} // Ensure _type is fetched for reference
  }`;
  try {
    const userDoc = await client.fetch<UserSanityDocument & { role: Role }>(query, { userId }); // Adjust type for fetched role
    if (!userDoc) return null;

    // Map to the User interface
    return {
      ...userDoc,
      _id: userDoc._id,
      _type: 'user',
      role: userDoc.role?._id ? { // Check if role resolved with an _id
          _type: 'reference', 
          _ref: userDoc.role._id, 
          resolved: userDoc.role 
      } : undefined,
    } as User;

  } catch (error) {
    console.error(`Error fetching user ${userId} from Sanity:`, error);
    return null;
  }
}


export async function createUser(data: UserInputData): Promise<User> {
  const client = getClient();
  // Check if user with email already exists
  const existingUserQuery = `*[_type == "user" && email == $email][0]`;
  const existingUser = await client.fetch(existingUserQuery, { email: data.email });
  if (existingUser) {
    throw new Error(`User with email "${data.email}" already exists.`);
  }

  try {
    const newUserDoc = {
      _type: 'user',
      name: data.name,
      email: data.email,
      password: data.password, // Storing plain text password - NOT FOR PRODUCTION
      role: {
        _type: 'reference',
        _ref: data.roleId,
      },
      status: data.status || "Active",
      avatarUrl: data.avatarUrl || undefined,
    };
    const createdUser = await client.create<UserSanityDocument>(newUserDoc);
    revalidatePath('/admin/users');
    
    // Fetch the newly created user with role details resolved for return
    return (await fetchUserById(createdUser._id))!;

  } catch (error) {
    console.error("Error creating user in Sanity:", error);
    throw new Error('Failed to create user.');
  }
}

export async function updateUser(userId: string, data: Partial<UserInputData>): Promise<User | null> {
  const client = getClient();
   // Check if new email conflicts with another user
  if (data.email) {
    const currentUser = await client.getDocument(userId);
    if (currentUser && data.email !== currentUser.email) {
        const existingUserQuery = `*[_type == "user" && email == $email && _id != $userId][0]`;
        const conflictingUser = await client.fetch(existingUserQuery, { email: data.email, userId });
        if (conflictingUser) {
            throw new Error(`Another user with email "${data.email}" already exists.`);
        }
    }
  }
  
  try {
    const patch = client.patch(userId);
    if (data.name) patch.set({ name: data.name });
    if (data.email) patch.set({ email: data.email });
    if (data.password) patch.set({ password: data.password }); // Updating plain text password - NOT FOR PRODUCTION
    if (data.roleId) patch.set({ role: { _type: 'reference', _ref: data.roleId } });
    if (data.status) patch.set({ status: data.status });
    if (data.avatarUrl !== undefined) { // Allows setting to null or empty string to remove avatar
      if (data.avatarUrl === null || data.avatarUrl === '') {
        patch.unset(['avatarUrl']);
      } else {
        patch.set({ avatarUrl: data.avatarUrl });
      }
    }


    await patch.commit();
    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/edit/${userId}`);
    
    return (await fetchUserById(userId));

  } catch (error) {
    console.error("Error updating user in Sanity:", error);
    throw new Error('Failed to update user.');
  }
}

export async function deleteUser(userId: string): Promise<void> {
  const client = getClient();
  try {
    await client.delete(userId);
    revalidatePath('/admin/users');
  } catch (error) {
    console.error("Error deleting user from Sanity:", error);
    throw new Error('Failed to delete user.');
  }
}

export async function authenticateUser(email: string, passwordAttempt: string): Promise<AuthUser | null> {
  const client = getClient();
  const query = `*[_type == "user" && email == $email][0]{
    _id,
    name,
    email,
    password, // Fetching plain text password - NOT FOR PRODUCTION
    "role": role->name.current, // Get the slug (name) of the role
    avatarUrl,
    status
  }`;
  try {
    const userDoc = await client.fetch<UserSanityDocument & { role: string }>(query, { email });

    if (!userDoc) {
      return null; // User not found
    }

    if (userDoc.status === 'Inactive') {
        console.warn(`Login attempt for inactive user: ${email}`);
        return null; // Inactive user
    }

    // IMPORTANT: Plain text password comparison. NOT SECURE FOR PRODUCTION.
    if (userDoc.password !== passwordAttempt) {
      return null; // Password incorrect
    }
    
    // Password matches (mock logic)
    const authUser: AuthUser = {
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role || 'customer', // Default to customer if role somehow missing
      avatarUrl: userDoc.avatarUrl,
      initials: userDoc.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase(),
    };
    return authUser;

  } catch (error) {
    console.error("Error authenticating user from Sanity:", error);
    return null;
  }
}
