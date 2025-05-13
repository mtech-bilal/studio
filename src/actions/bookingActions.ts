// src/actions/bookingActions.ts
"use server";

import { client } from "@/sanity/client";
import { revalidatePath } from "next/cache";
import type { SanityDocument } from "next-sanity";

interface BookingData {
  customerName: string;
  customerEmail: string;
  physicianId: string; // This will be a reference: {_type: 'reference', _ref: physicianId}
  bookingDateTime: string; // ISO string
  serviceType?: 'physical' | 'online';
  status?: string;
}

export interface BookingResult extends SanityDocument {
  customerName: string;
  physician: {
    _ref: string;
    _type: 'reference';
    name?: string; // For confirmation page
  };
  bookingDateTime: string;
}


export async function submitBooking(data: BookingData): Promise<{success: boolean, booking?: BookingResult, error?: string}> {
  try {
    const bookingPayload = {
      _type: 'booking',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      physician: {
        _type: 'reference',
        _ref: data.physicianId,
      },
      bookingDateTime: data.bookingDateTime,
      serviceType: data.serviceType,
      status: data.status || 'pending', // Default status
    };

    const result = await client.create(bookingPayload);
    
    // Fetch physician name for confirmation page if needed
    // This can be optimized if physicianName is already available on the client
    const physicianQuery = '*[_type == "physician" && _id == $id][0]{name}';
    const physicianDetails = await client.fetch(physicianQuery, { id: data.physicianId });

    // Revalidate paths if you have pages displaying bookings that need to update
    revalidatePath('/admin/dashboard'); // Example, adjust as needed
    // revalidatePath('/admin/bookings'); // If such a page exists

    return { 
        success: true, 
        booking: {
            ...(result as BookingResult), // Cast result
            physician: { // Ensure physician object has name for confirmation
                _ref: data.physicianId,
                _type: 'reference',
                name: physicianDetails?.name || 'N/A'
            }
        }
    };
  } catch (error) {
    console.error("Sanity booking submission error:", error);
    let errorMessage = "An unknown error occurred during booking.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
