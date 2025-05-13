// src/sanity/client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
// const token = process.env.SANITY_API_TOKEN; // For server-side mutations

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable");
}
if (!dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET environment variable");
}
if (!apiVersion) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_API_VERSION environment variable");
}


export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: process.env.NODE_ENV === 'production', // server-side is statically generated, always use CDN in production
  // perspective: 'published', // 'raw' if you need to access drafts
  // token, // Only if you need to perform mutations from server components or server actions without exposing the token to the client
});

// Client for server-side mutations (Server Actions)
// export const privilegedClient = createClient({
//   projectId,
//   dataset,
//   apiVersion,
//   useCdn: false, // Mutations should not use CDN
//   token, // API token with write permissions
// });
