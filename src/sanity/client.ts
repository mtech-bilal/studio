// src/sanity/client.ts
import { createClient, type SanityClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
export const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. Please ensure it is set in your .env.local file.");
}
if (!dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET environment variable. Please ensure it is set in your .env.local file.");
}
if (!apiVersion) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_API_VERSION environment variable. Please ensure it is set in your .env.local file.");
}

export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: false, // `false` if you want to ensure fresh data, `true` for faster framerwork builds
  token: token, // Required for write operations and mutations
  perspective: 'published', // Or 'preview' or 'raw'
});

// Helper function to handle Sanity image asset URLs if you store images in Sanity
// For now, we assume avatarUrl is a direct string URL.
// If using Sanity's image type, you'd use something like this:
// import imageUrlBuilder from '@sanity/image-url';
// const builder = imageUrlBuilder(client);
// export function urlFor(source: any) {
//   return builder.image(source);
// }
