// src/sanity/schemas/role.ts
import type { Rule } from 'sanity';

export default {
  name: 'role',
  title: 'Role',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Role Name',
      type: 'string',
      description: 'The internal name of the role (e.g., admin, physician, customer). This is used for logic.',
      validation: (Rule: Rule) => Rule.required().lowercase(),
    },
    {
      name: 'title',
      title: 'Display Title',
      type: 'string',
      description: 'The human-readable title for the role (e.g., Administrator, Physician, Customer).',
      validation: (Rule: Rule) => Rule.required(),
    },
    // Permissions are now implicit based on role name as per user request.
    // If granular permissions are needed later, this can be expanded.
    // {
    //   name: 'permissions',
    //   title: 'Permissions',
    //   type: 'array',
    //   of: [{type: 'string'}],
    //   options: {
    //     list: [
    //       {title: 'Manage Users', value: 'manage_users'},
    //       {title: 'Manage Physicians', value: 'manage_physicians'},
    //       // ... other permissions
    //     ]
    //   }
    // }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'name',
    },
  },
};
