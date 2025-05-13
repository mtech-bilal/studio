// src/sanity/schemas/physician.ts
import { defineType, defineField } from 'sanity';
import { Stethoscope } from 'lucide-react';

export default defineType({
  name: 'physician',
  title: 'Physician',
  type: 'document',
  icon: Stethoscope,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: "The physician's full name (e.g., Dr. Emily Carter).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'specialty',
      title: 'Specialty',
      type: 'string',
      description: "The physician's medical specialty (e.g., Cardiology, Neurology).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: "Optional: Physician's contact email.",
      validation: (Rule) => Rule.email().optional(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: "Optional: Physician's contact phone number.",
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 4,
      description: "Optional: A brief biography or description of the physician.",
    }),
    defineField({
      name: 'ratePhysical',
      title: 'Physical Consultation Rate',
      type: 'number',
      description: 'Rate for an in-person consultation. Leave empty if not applicable.',
      validation: (Rule) => Rule.min(0).optional(),
    }),
    defineField({
      name: 'rateOnline',
      title: 'Online Consultation Rate',
      type: 'number',
      description: 'Rate for an online consultation. Leave empty if not applicable.',
      validation: (Rule) => Rule.min(0).optional(),
    }),
    defineField({
      name: 'avatarUrl',
      title: 'Avatar URL',
      type: 'url',
      description: "Optional: URL to the physician's profile picture.",
    }),
    // If linking to a user account for the physician to log in:
    // defineField({
    //   name: 'userAccount',
    //   title: 'User Account',
    //   type: 'reference',
    //   to: [{ type: 'user' }],
    //   description: 'Optional: Link to the user account associated with this physician for portal access.',
    // }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'specialty',
      media: 'avatarUrl',
    },
     prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media: media || Stethoscope,
      };
    },
  },
});
