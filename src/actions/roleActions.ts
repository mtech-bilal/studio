// src/actions/roleActions.ts
'use server';

import { client } from '@/sanity/client';
import type { SanityDocument, SanityDocumentStub } from 'next-sanity';

// This interface can be shared or defined more globally if needed
export interface Role extends SanityDocument {
  name: string; // Internal name
  title: string; // Display title
}

export interface RoleInput extends SanityDocumentStub {
    name: string;
    title: string;
    _type: 'role';
}


export async function createRole(roleData: Omit<RoleInput, '_type'>): Promise<Role> {
  const newRole = await client.create({ _type: 'role', ...roleData });
  return newRole as Role;
}

export async function updateRole(roleId: string, roleData: Partial<Omit<RoleInput, '_type'>>): Promise<Role> {
  const updatedRole = await client.patch(roleId).set(roleData).commit();
  return updatedRole as Role;
}

export async function deleteRole(roleId: string): Promise<void> {
  await client.delete(roleId);
}
