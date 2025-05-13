// src/sanity/schemas/payment.ts
import type { Rule } from 'sanity';

export default {
  name: 'payment',
  title: 'Payment',
  type: 'document',
  fields: [
    {
      name: 'customerName', // Or reference to customer document
      title: 'Customer Name',
      type: 'string', // Change to reference if you have a 'customer' schema and want to link them
      validation: (Rule: Rule) => Rule.required(),
    },
    {
        name: 'customerEmail',
        title: 'Customer Email',
        type: 'string',
        validation: (Rule: Rule) => Rule.email(),
    },
    {
      name: 'physicianName', // Or reference to physician document
      title: 'Physician Name',
      type: 'string', // Change to reference if linking
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'booking', // Optional link to the booking this payment is for
      title: 'Associated Booking',
      type: 'reference',
      to: [{type: 'booking'}]
    },
    {
      name: 'paymentDate',
      title: 'Payment Date',
      type: 'datetime',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'amount',
      title: 'Amount',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().min(0),
    },
    {
      name: 'paymentType', // e.g., Online, Physical (Cash/Card)
      title: 'Payment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Online', value: 'online' },
          { title: 'Physical - Card', value: 'physical_card' },
          { title: 'Physical - Cash', value: 'physical_cash' },
        ],
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Paid', value: 'paid' },
          { title: 'Pending', value: 'pending' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
        name: 'transactionId',
        title: 'Transaction ID',
        type: 'string',
        description: 'Optional transaction ID from payment gateway.'
    }
  ],
  preview: {
    select: {
      customer: 'customerName',
      amount: 'amount',
      date: 'paymentDate',
      status: 'status',
    },
    prepare({ customer, amount, date, status }: { customer?: string; amount?: number; date?: string; status?: string }) {
      const paymentDate = date ? new Date(date).toLocaleDateString() : 'No date';
      return {
        title: `Payment from ${customer || 'N/A'} - ${amount ? `$${amount.toFixed(2)}` : 'N/A'}`,
        subtitle: `Date: ${paymentDate} - Status: ${status || 'N/A'}`,
      };
    },
  },
};
