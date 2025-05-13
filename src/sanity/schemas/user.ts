// src/sanity/schemas/user.ts
import { defineType, defineField } from 'sanity';
import { User as UserIcon } from 'lucide-react';

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'password', // IMPORTANT: Storing plain text passwords is NOT secure for production.
      title: 'Password (Plain Text - For Demo Only)',
      type: 'string',
      description: 'For demonstration purposes only. In a real application, store hashed passwords or use an auth provider.',
      hidden: ({currentUser}) => { // Hide for non-admins in studio if sensitive
        return !currentUser?.roles.some(role => role.name === 'administrator');
      }
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'reference',
      to: [{ type: 'role' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'Active' },
          { title: 'Inactive', value: 'Inactive' },
        ],
        layout: 'radio',
      },
      initialValue: 'Active',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatarUrl',
      title: 'Avatar URL',
      type: 'url',
      description: 'Optional: URL to the user\'s avatar image.',
    }),
    // If you want to use Sanity's image asset system:
    // defineField({
    //   name: 'avatar',
    //   title: 'Avatar',
    //   type: 'image',
    //   options: {
    //     hotspot: true, // Enables image cropping
    //   },
    // }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      media: 'avatarUrl', // or 'avatar' if using image type
      roleName: 'role.name', // Accessing slug of referenced role
      roleTitle: 'role.title' // Accessing title of referenced role
    },
    prepare({ title, subtitle, media, roleTitle }) {
      return {
        title,
        subtitle: `${subtitle} (${roleTitle || 'No role'})`,
        media: media || UserIcon, // Use UserIcon if no avatar
      };
    },
  },
  initialValue: {
    status: 'Active',
  }
});
