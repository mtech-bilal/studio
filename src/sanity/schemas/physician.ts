// src/sanity/schemas/physician.ts
import type { Rule } from 'sanity';

export default {
  name: 'physician',
  title: 'Physician',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'specialty',
      title: 'Specialty',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'ratePhysical',
      title: 'Physical Consultation Rate',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(0),
    },
    {
      name: 'rateOnline',
      title: 'Online Consultation Rate',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(0),
    },
    {
      name: 'userAccount',
      title: 'User Account',
      type: 'reference',
      to: [{ type: 'user' }],
      description: 'Link to the user account if the physician can log in.',
      options: {
        filter: 'role->name == "physician"', // Optional: filter to only show users with 'physician' role
      },
    },
    {
      name: 'avatar', // Add avatar for physician specific image
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'specialty',
      media: 'avatar',
    },
  },
};
