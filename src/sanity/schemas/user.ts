// src/sanity/schemas/user.ts
import type { Rule } from 'sanity';

export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().email(),
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true, // Enables image cropping
      },
    },
    {
      name: 'role',
      title: 'Role',
      type: 'reference',
      to: [{ type: 'role' }],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
        name: 'status',
        title: 'Status',
        type: 'string',
        options: {
            list: [
                { title: 'Active', value: 'active' },
                { title: 'Inactive', value: 'inactive' },
            ],
            layout: 'radio'
        },
        initialValue: 'active'
    }
    // Password handling should ideally be done via an auth provider like NextAuth.js
    // Storing password hashes directly in Sanity is possible but less secure without proper measures.
    // {
    //   name: 'passwordHash',
    //   title: 'Password Hash',
    //   type: 'string',
    //   // Make this field hidden or read-only in the studio if managed elsewhere
    // },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      media: 'avatar',
      roleName: 'role.title',
    },
    prepare({ title, subtitle, media, roleName }: { title?: string; subtitle?: string; media?: any, roleName?: string}) {
      return {
        title: title,
        subtitle: `${subtitle} (${roleName || 'No role'})`,
        media: media,
      };
    },
  },
};
