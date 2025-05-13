// src/actions/roleActions.ts
'use server';

import { client } from '@/sanity/client';
import type { SanityDocument, Slug } from 'next-sanity';
import { revalidatePath } from 'next/cache';

export interface Role extends SanityDocument {
  _id: string;
  _type: 'role';
  name: Slug; 
  title: string;
  description?: string;
}

export interface RoleInput {
    name: string; // Will be converted to slug for internal name
    title: string;
    description?: string;
}

export async function fetchRoles(): Promise<Role[]> {
  const query = `*[_type == "role"] | order(title asc)`;
  try {
    const roles = await client.fetch<Role[]>(query);
    return roles;
  } catch (error) {
    console.error("Error fetching roles from Sanity:", error);
    return [];
  }
}

export async function createRole(roleData: RoleInput): Promise<Role> {
  try {
    const newRole = await client.create<Role>({
      _type: 'role',
      name: { _type: 'slug', current: roleData.name.toLowerCase().trim().replace(/\s+/g, '_') },
      title: roleData.title.trim(),
      description: roleData.description?.trim(),
    });
    revalidatePath('/admin/roles');
    return newRole;
  } catch (error) {
    console.error("Error creating role in Sanity:", error);
    if (error instanceof Error && error.message.includes('slug')) { // Basic check for slug conflict
        throw new Error(`Role with internal name "${roleData.name}" might already exist or is invalid.`);
    }
    throw new Error('Failed to create role.');
  }
}

export async function updateRole(roleId: string, roleData: Partial<RoleInput>): Promise<Role | null> {
  try {
    const patch = client.patch(roleId);
    if (roleData.title) {
      patch.set({ title: roleData.title.trim() });
    }
    if (roleData.description !== undefined) {
        patch.set({ description: roleData.description.trim() });
    }
    // Internal name (slug) is typically not updated after creation.

    const updatedRole = await patch.commit<Role>();
    revalidatePath('/admin/roles');
    revalidatePath(`/admin/roles/edit/${roleId}`);
    return updatedRole;
  } catch (error) {
    console.error("Error updating role in Sanity:", error);
    throw new Error('Failed to update role.');
  }
}

export async function deleteRole(roleId: string): Promise<void> {
  // Prevent deletion of core roles (server-side check)
  const coreRoleDoc = await client.getDocument(roleId);
  if (coreRoleDoc && ['admin', 'physician', 'customer'].includes((coreRoleDoc.name as Slug)?.current)) {
      throw new Error(`Core system role "${coreRoleDoc.title}" cannot be deleted.`);
  }

  try {
    await client.delete(roleId);
    revalidatePath('/admin/roles');
  } catch (error) {
    console.error("Error deleting role from Sanity:", error);
    // Check if the error is due to referenced documents
    if (error instanceof Error && error.message.toLowerCase().includes('references')) {
        throw new Error('Cannot delete role. It is currently assigned to one or more users.');
    }
    throw new Error('Failed to delete role.');
  }
}
