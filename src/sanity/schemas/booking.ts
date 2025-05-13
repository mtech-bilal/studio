// src/sanity/schemas/booking.ts
import type { Rule } from 'sanity';

export default {
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().email(),
    },
    {
      name: 'physician',
      title: 'Physician',
      type: 'reference',
      to: [{ type: 'physician' }],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'bookingDateTime',
      title: 'Booking Date and Time',
      type: 'datetime',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Pending Confirmation', value: 'pending' },
        ],
        layout: 'radio', // Or 'dropdown'
      },
      initialValue: 'pending',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'serviceType', // e.g., Physical, Online
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          { title: 'Physical', value: 'physical' },
          { title: 'Online', value: 'online' },
        ],
      },
    },
    // You might want to link to a payment record if applicable
    // {
    //   name: 'payment',
    //   title: 'Payment Record',
    //   type: 'reference',
    //   to: [{ type: 'payment' }],
    // },
  ],
  preview: {
    select: {
      customer: 'customerName',
      physician: 'physician.name',
      datetime: 'bookingDateTime',
      status: 'status',
    },
    prepare({ customer, physician, datetime, status }: { customer?: string; physician?: string; datetime?: string; status?: string }) {
      const date = datetime ? new Date(datetime).toLocaleDateString() : 'No date';
      const time = datetime ? new Date(datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) : '';
      return {
        title: `${customer || 'N/A'} with ${physician || 'N/A'}`,
        subtitle: `${date} ${time} - ${status || 'N/A'}`,
      };
    },
  },
  initialValue: {
    status: 'pending',
  }
};
