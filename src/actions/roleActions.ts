// src/actions/roleActions.ts
'use server';

// Mock data store for roles
let mockRoles: Role[] = [
  { _id: 'role1', name: 'admin', title: 'Administrator', _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'role' },
  { _id: 'role2', name: 'physician', title: 'Physician', _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'role' },
  { _id: 'role3', name: 'customer', title: 'Customer', _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '1', _type: 'role' },
];

export interface Role {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
  _type?: 'role';
  name: string; // Internal name
  title: string; // Display title
}

export interface RoleInput { // Renamed from RoleInputSanity to RoleInput
    name: string;
    title: string;
}

export async function fetchMockRoles(): Promise<Role[]> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
    return JSON.parse(JSON.stringify(mockRoles)); // Return a deep copy
}

export async function createRole(roleData: RoleInput): Promise<Role> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newRole: Role = {
    _id: `role${Date.now()}`,
    ...roleData,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: '1',
    _type: 'role',
  };
  mockRoles.push(newRole);
  return { ...newRole };
}

export async function updateRole(roleId: string, roleData: Partial<RoleInput>): Promise<Role | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const roleIndex = mockRoles.findIndex(r => r._id === roleId);
  if (roleIndex === -1) {
    return null;
  }
  mockRoles[roleIndex] = { ...mockRoles[roleIndex], ...roleData, _updatedAt: new Date().toISOString() };
  return { ...mockRoles[roleIndex] };
}

export async function deleteRole(roleId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockRoles = mockRoles.filter(r => r._id !== roleId);
}
