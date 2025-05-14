// src/sanity/client.ts
import { createClient, type SanityClient } from "@sanity/client";

// Store them, but don't create client immediately
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityProjectId = projectId; // export for potential direct use if needed elsewhere, though getClient is preferred

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const sanityDataset = dataset; // export for potential direct use

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
export const sanityApiVersion = apiVersion; // export for potential direct use

const token = process.env.SANITY_API_TOKEN;
export const sanityToken = token; // export for potential direct use


let clientInstance: SanityClient | null = null;

export function getClient(): SanityClient {
  if (!projectId) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. Please ensure it is set in your .env.local file and the server has been restarted.");
  }
  if (!dataset) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET environment variable. Please ensure it is set in your .env.local file and the server has been restarted.");
  }
  if (!apiVersion) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_API_VERSION environment variable. Please ensure it is set in your .env.local file and the server has been restarted.");
  }
  // Note: SANITY_API_TOKEN is optional for read operations but required for writes. 
  // We don't throw an error if it's missing here, but write operations will fail.

  if (!clientInstance) {
    clientInstance = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for reads
      token: token, // Pass token if available
      perspective: 'published', 
    });
  }
  return clientInstance;
}

// Helper function to handle Sanity image asset URLs if you store images in Sanity
// For now, we assume avatarUrl is a direct string URL.
// If using Sanity's image type, you'd use something like this:
// import imageUrlBuilder from '@sanity/image-url';
// const builder = imageUrlBuilder(getClient()); // Initialize builder with the client
// export function urlFor(source: any) {
//   return builder.image(source);
// }
