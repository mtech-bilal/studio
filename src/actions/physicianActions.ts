// src/actions/physicianActions.ts
'use server';

// Removed SanityDocument and SanityDocumentStub imports

// Mock data store (in-memory, will reset on server restart)
let mockPhysicians: Physician[] = [
  { _id: 'physician1', name: 'Dr. Emily Carter', specialty: 'Cardiology', ratePhysical: 150, rateOnline: 75, _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'physician' },
  { _id: 'physician2', name: 'Dr. John Smith', specialty: 'Neurology', ratePhysical: 180, rateOnline: 90, _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'physician'  },
  { _id: 'physician3', name: 'Dr. Sarah Jones', specialty: 'Pediatrics', ratePhysical: 120, rateOnline: 60, _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'physician'  },
];


export interface Physician {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
  _type?: 'physician';
  name: string;
  specialty: string;
  ratePhysical: number | null;
  rateOnline: number | null;
  userAccount?: { _ref: string; _type: 'reference' }; // Kept for structure, but not used with Sanity
}

export interface PhysicianInputData {
  name: string;
  specialty: string;
  ratePhysical: number | null;
  rateOnline: number | null;
  userAccount?: { _ref: string; _type: 'reference' };
}


export async function fetchMockPhysicians(): Promise<Physician[]> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
  return JSON.parse(JSON.stringify(mockPhysicians)); // Return a deep copy
}

export async function createPhysician(data: PhysicianInputData): Promise<Physician> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
  const newPhysician: Physician = {
    _id: `physician${Date.now()}`,
    ...data,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: '1',
    _type: 'physician',
  };
  mockPhysicians.push(newPhysician);
  return { ...newPhysician };
}

export async function updatePhysician(id: string, data: Partial<PhysicianInputData>): Promise<Physician | null> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
  const physicianIndex = mockPhysicians.findIndex(p => p._id === id);
  if (physicianIndex === -1) {
    return null;
  }
  mockPhysicians[physicianIndex] = { ...mockPhysicians[physicianIndex], ...data, _updatedAt: new Date().toISOString() };
  return { ...mockPhysicians[physicianIndex] };
}

export async function deletePhysician(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
  mockPhysicians = mockPhysicians.filter(p => p._id !== id);
}
