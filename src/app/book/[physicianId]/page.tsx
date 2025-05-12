// src/app/book/[physicianId]/page.tsx
import { BookingForm } from '@/components/BookingForm';
import { notFound } from 'next/navigation';

// Mock function to get physician details by ID
// In a real app, fetch this from your database/API
const getPhysicianDetails = (id: string): { name: string } | null => {
  const physicians: { [key: string]: { name: string } } = {
    "dr-smith": { name: "Dr. John Smith - Cardiologist" },
    "dr-jones": { name: "Dr. Sarah Jones - Dermatologist" },
    "dr-williams": { name: "Dr. Robert Williams - Pediatrician" },
    "dr-brown": { name: "Dr. Emily Brown - General Practitioner" },
  };
  return physicians[id] || null;
};


interface BookingPageProps {
  params: {
    physicianId: string;
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  const { physicianId } = params;
  const physicianDetails = getPhysicianDetails(physicianId);

  if (!physicianDetails) {
    notFound(); // Show 404 if physician ID is invalid
  }


  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <BookingForm physicianId={physicianId} physicianName={physicianDetails.name} />
    </main>
  );
}

// Optional: Generate static paths if you know all physician IDs beforehand
// export async function generateStaticParams() {
//   // Fetch all physician IDs
//   const physicianIds = ["dr-smith", "dr-jones", "dr-williams", "dr-brown"];
//   return physicianIds.map((id) => ({
//     physicianId: id,
//   }));
// }
