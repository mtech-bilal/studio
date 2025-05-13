// src/sanity/schemas/booking.ts
import { defineType, defineField } from 'sanity';
import { CalendarCheck2 } from 'lucide-react';

export default defineType({
  name: 'booking',
  title: 'Booking',
  type: 'document',
  icon: CalendarCheck2,
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'physician',
      title: 'Physician',
      type: 'reference',
      to: [{ type: 'physician' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookingDateTime',
      title: 'Booking Date and Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15, // Optional: set time step for time picker
      },
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          { title: 'Physical Consultation', value: 'physical' },
          { title: 'Online Consultation', value: 'online' },
        ],
        layout: 'radio', // Or 'dropdown'
      },
      // validation: (Rule) => Rule.required(), // Make required if always needed
    }),
    defineField({
      name: 'status',
      title: 'Booking Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'notes',
        title: 'Notes',
        type: 'text',
        rows: 3,
        description: 'Optional: Any internal notes about this booking.'
    })
  ],
  preview: {
    select: {
      customer: 'customerName',
      physicianName: 'physician.name',
      dateTime: 'bookingDateTime',
      status: 'status',
    },
    prepare({ customer, physicianName, dateTime, status }) {
      const date = dateTime ? new Date(dateTime).toLocaleDateString() : 'No date';
      const time = dateTime ? new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      return {
        title: `${customer} with ${physicianName || 'N/A'}`,
        subtitle: `${date} at ${time} - Status: ${status || 'N/A'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Booking Date, Newest First',
      name: 'bookingDateDesc',
      by: [{field: 'bookingDateTime', direction: 'desc'}]
    },
    {
      title: 'Booking Date, Oldest First',
      name: 'bookingDateAsc',
      by: [{field: 'bookingDateTime', direction: 'asc'}]
    }
  ]
});
