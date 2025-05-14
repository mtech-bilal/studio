// src/actions/physicianActions.ts
'use server';

import { getClient } from '@/sanity/client';
import type { SanityDocument } from 'next-sanity';
import { revalidatePath } from 'next/cache';

export interface Physician extends SanityDocument {
  _id: string;
  _type: 'physician';
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  bio?: string;
  ratePhysical: number | null;
  rateOnline: number | null;
  avatarUrl?: string;
  // userAccount?: SanityReference; // If linking to a user account
}

export interface PhysicianInputData {
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  bio?: string;
  ratePhysical: number | null;
  rateOnline: number | null;
  avatarUrl?: string;
  // userAccountId?: string; // If linking to a user account
}

export async function fetchPhysicians(): Promise<Physician[]> {
  const client = getClient();
  const query = `*[_type == "physician"] | order(name asc)`;
  try {
    const physicians = await client.fetch<Physician[]>(query);
    return physicians;
  } catch (error) {
    console.error("Error fetching physicians from Sanity:", error);
    return [];
  }
}

export async function fetchPhysicianById(id: string): Promise<Physician | null> {
  const client = getClient();
  const query = `*[_type == "physician" && _id == $id][0]`;
  try {
    const physician = await client.fetch<Physician | null>(query, { id });
    return physician;
  } catch (error) {
    console.error(`Error fetching physician ${id} from Sanity:`, error);
    return null;
  }
}

export async function createPhysician(data: PhysicianInputData): Promise<Physician> {
  const client = getClient();
  try {
    const newPhysicianDoc = {
      _type: 'physician',
      name: data.name,
      specialty: data.specialty,
      email: data.email,
      phone: data.phone,
      bio: data.bio,
      ratePhysical: data.ratePhysical,
      rateOnline: data.rateOnline,
      avatarUrl: data.avatarUrl,
      // userAccount: data.userAccountId ? { _type: 'reference', _ref: data.userAccountId } : undefined,
    };
    const createdPhysician = await client.create<Physician>(newPhysicianDoc);
    revalidatePath('/admin/physicians');
    return createdPhysician;
  } catch (error) {
    console.error("Error creating physician in Sanity:", error);
    throw new Error('Failed to create physician.');
  }
}

export async function updatePhysician(id: string, data: Partial<PhysicianInputData>): Promise<Physician | null> {
  const client = getClient();
  try {
    const patch = client.patch(id);
    if (data.name) patch.set({ name: data.name });
    if (data.specialty) patch.set({ specialty: data.specialty });
    if (data.email !== undefined) patch.set({ email: data.email });
    if (data.phone !== undefined) patch.set({ phone: data.phone });
    if (data.bio !== undefined) patch.set({ bio: data.bio });
    if (data.ratePhysical !== undefined) patch.set({ ratePhysical: data.ratePhysical });
    if (data.rateOnline !== undefined) patch.set({ rateOnline: data.rateOnline });
    if (data.avatarUrl !== undefined) patch.set({ avatarUrl: data.avatarUrl });
    // if (data.userAccountId !== undefined) {
    //   patch.set({ userAccount: data.userAccountId ? { _type: 'reference', _ref: data.userAccountId } : undefined });
    // } else if (data.userAccountId === null) { // Explicitly unset
    //   patch.unset(['userAccount']);
    // }


    const updatedPhysician = await patch.commit<Physician>();
    revalidatePath('/admin/physicians');
    revalidatePath(`/admin/physicians/edit/${id}`);
    return updatedPhysician;
  } catch (error) {
    console.error("Error updating physician in Sanity:", error);
    throw new Error('Failed to update physician.');
  }
}

export async function deletePhysician(id: string): Promise<void> {
  const client = getClient();
  try {
    // Check for related bookings before deleting
    const relatedBookingsQuery = `count(*[_type == "booking" && physician._ref == $id])`;
    const bookingCount = await client.fetch<number>(relatedBookingsQuery, { id });

    if (bookingCount > 0) {
      throw new Error(`Cannot delete physician. They have ${bookingCount} associated booking(s). Please reassign or cancel bookings first.`);
    }

    await client.delete(id);
    revalidatePath('/admin/physicians');
  } catch (error) {
    console.error("Error deleting physician from Sanity:", error);
    if (error instanceof Error) throw error; // Re-throw if it's already an error with a message
    throw new Error('Failed to delete physician.');
  }
}
