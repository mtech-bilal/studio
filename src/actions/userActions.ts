// src/actions/userActions.ts
'use server';

import { client } from '@/sanity/client';
import type { SanityDocument, Slug, SanityReference } from 'next-sanity';
import type { Role } from './roleActions';
import { revalidatePath } from 'next/cache';

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
  // Fetch users and their referenced role's name (slug) and title
  const query = `*[_type == "user"]{
    ...,
    "role": role->{_id, name, title} // Resolve role reference
  } | order(_createdAt desc)`;
  try {
    const users = await client.fetch<User[]>(query);
    // Transform role to just be the role name (slug's current value) for simpler use in AuthUser
    return users.map(u => ({
        ...u,
        role: u.role?.resolved?.name?.current || 'unknown' // Simplified for AuthUser context
    })) as unknown as User[]; // Adjust type assertion as needed based on where User is used
  } catch (error) {
    console.error("Error fetching users from Sanity:", error);
    return [];
  }
}

export async function fetchUserById(userId: string): Promise<User | null> {
  const query = `*[_type == "user" && _id == $userId][0]{
    ...,
    "role": role->{_id, name, title}
  }`;
  try {
    const user = await client.fetch<UserSanityDocument>(query, { userId });
    if (!user) return null;

    // Map to the User interface, primarily to ensure role is correctly structured if needed
    return {
      ...user,
      _id: user._id,
      _type: 'user',
      role: user.role?._ref ? { _type: 'reference', _ref: user.role._ref, resolved: { name: {current: (user.role as any).name?.current || ''}} as Role } : undefined,
    } as User;

  } catch (error) {
    console.error(`Error fetching user ${userId} from Sanity:`, error);
    return null;
  }
}


export async function createUser(data: UserInputData): Promise<User> {
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
    if (data.avatarUrl !== undefined) patch.set({ avatarUrl: data.avatarUrl }); // Allow setting to null/empty

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
  try {
    await client.delete(userId);
    revalidatePath('/admin/users');
  } catch (error) {
    console.error("Error deleting user from Sanity:", error);
    throw new Error('Failed to delete user.');
  }
}

export async function authenticateUser(email: string, passwordAttempt: string): Promise<AuthUser | null> {
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

