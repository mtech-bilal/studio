// src/sanity/schemas/customer.ts
import type { Rule } from 'sanity';

export default {
  name: 'customer',
  title: 'Customer',
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
      name: 'lastBookingDate',
      title: 'Last Booking Date',
      type: 'datetime',
    },
    {
      name: 'totalBookings',
      title: 'Total Bookings',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(0).integer(),
      initialValue: 0,
    },
    // {
    //   name: 'userAccount',
    //   title: 'User Account',
    //   type: 'reference',
    //   to: [{ type: 'user' }],
    //   description: 'Link to the user account if the customer can log in.',
    //   options: {
    //     filter: 'role->name == "customer"',
    //   },
    // },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
};
