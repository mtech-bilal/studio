// src/actions/bookingActions.ts
"use server";

import { revalidatePath } from "next/cache";
// Removed SanityDocument import

interface BookingData {
  customerName: string;
  customerEmail: string;
  physicianId: string;
  bookingDateTime: string; // ISO string
  serviceType?: 'physical' | 'online';
  status?: string;
}

// Simplified BookingResult as SanityDocument is no longer used
export interface BookingResult {
  _id: string; // Mock ID
  customerName: string;
  physician: {
    _id: string; // Mock physician ID
    name?: string; // For confirmation page
  };
  bookingDateTime: string;
}


export async function submitBooking(data: BookingData): Promise<{success: boolean, booking?: BookingResult, error?: string}> {
  try {
    // Mock booking creation
    console.log("Mock booking submission:", data);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const mockBookingId = `booking_${Date.now()}`;
    
    // In a real scenario, you might fetch physician name if not passed or available
    // For mock, we'll assume physicianName is available or passed through data if needed for confirmation directly
    // const physicianDetails = { name: "Dr. Mock Physician" }; // Example

    revalidatePath('/admin/dashboard');

    return { 
        success: true, 
        booking: {
            _id: mockBookingId,
            customerName: data.customerName,
            physician: { 
                _id: data.physicianId,
                name: "Selected Physician" // Placeholder, ideally fetch or pass physician name
            },
            bookingDateTime: data.bookingDateTime,
        }
    };
  } catch (error) {
    console.error("Mock booking submission error:", error);
    let errorMessage = "An unknown error occurred during booking.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
