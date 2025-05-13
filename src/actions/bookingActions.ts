// src/actions/bookingActions.ts
"use server";

import { client } from '@/sanity/client';
import type { SanityDocument, SanityReference } from 'next-sanity';
import { revalidatePath } from "next/cache";
import type { Physician } from './physicianActions';

export interface BookingData {
  customerName: string;
  customerEmail: string;
  physicianId: string; // Sanity document ID for the physician
  bookingDateTime: string; // ISO string
  serviceType?: 'physical' | 'online';
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface BookingResult extends SanityDocument {
  _id: string;
  _type: 'booking';
  customerName: string;
  customerEmail: string;
  physician: SanityReference & { resolved?: Pick<Physician, 'name' | '_id'> }; // Resolved physician details
  bookingDateTime: string;
  serviceType?: string;
  status: string;
  notes?: string;
}

export async function submitBooking(data: BookingData): Promise<{success: boolean, booking?: BookingResult, error?: string}> {
  try {
    const bookingDoc = {
      _type: 'booking',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      physician: {
        _type: 'reference',
        _ref: data.physicianId,
      },
      bookingDateTime: data.bookingDateTime,
      serviceType: data.serviceType,
      status: data.status || 'pending',
      notes: data.notes,
    };

    const createdBooking = await client.create<BookingResult>(bookingDoc);
    
    // Revalidate relevant paths
    revalidatePath('/admin/dashboard'); // For admin to see new bookings
    // Potentially revalidate a patient's booking history page if it exists

    // Fetch the physician's name for the confirmation page
    const physician = await client.getDocument<Pick<Physician, 'name' | '_id'>>(data.physicianId);

    return { 
        success: true, 
        booking: {
            ...createdBooking,
            physician: {
                _type: 'reference',
                _ref: data.physicianId,
                resolved: physician ? { name: physician.name, _id: physician._id } : { name: "Selected Physician", _id: data.physicianId }
            }
        }
    };
  } catch (error) {
    console.error("Error submitting booking to Sanity:", error);
    let errorMessage = "An unknown error occurred during booking.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
