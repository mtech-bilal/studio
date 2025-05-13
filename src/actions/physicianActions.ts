// src/actions/physicianActions.ts
'use server';

import { client } from '@/sanity/client';
import type { SanityDocument, SanityDocumentStub } from 'next-sanity';

export interface Physician extends SanityDocument {
  name: string;
  specialty: string;
  ratePhysical: number | null;
  rateOnline: number | null;
  userAccount?: { _ref: string; _type: 'reference' };
}

// Input type for creating/updating a physician
export interface PhysicianInputData {
  name: string;
  specialty: string;
  ratePhysical: number | null;
  rateOnline: number | null;
  userAccount?: { _ref: string; _type: 'reference' };
}

// Type for Sanity create payload
interface PhysicianSanityPayload extends SanityDocumentStub, PhysicianInputData {
  _type: 'physician';
}


export async function createPhysician(data: PhysicianInputData): Promise<Physician> {
  const payload: PhysicianSanityPayload = { ...data, _type: 'physician' };
  const newPhysician = await client.create(payload);
  return newPhysician as Physician;
}

export async function updatePhysician(id: string, data: Partial<PhysicianInputData>): Promise<Physician> {
  const updatedPhysician = await client.patch(id).set(data).commit();
  return updatedPhysician as Physician;
}

export async function deletePhysician(id: string): Promise<void> {
  await client.delete(id);
}
