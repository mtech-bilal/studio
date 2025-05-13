// src/sanity/client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
const token = process.env.SANITY_API_TOKEN; // For server-side mutations

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. Please ensure it is set in your .env.local file.");
}
if (!dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET environment variable. Please ensure it is set in your .env.local file.");
}
if (!apiVersion) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_API_VERSION environment variable. Please ensure it is set in your .env.local file.");
}

const hasToken = typeof token === 'string' && token.trim() !== '';

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  // Use CDN only if it's production and no token is provided (token implies mutations or draft reads)
  useCdn: !hasToken && process.env.NODE_ENV === 'production',
  // perspective: 'published', // 'raw' if you need to access drafts
  token: hasToken ? token : undefined, // Use token if available for authenticated requests
});

// Example for a dedicated privileged client if needed, though the above client can also handle it
// export const privilegedClient = createClient({
//   projectId,
//   dataset,
//   apiVersion,
//   useCdn: false, // Mutations should not use CDN
//   token, // API token with write permissions, ensure this is set in .env.local
// });
