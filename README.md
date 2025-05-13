# Firebase Studio (BookDoc Project)

This is a Next.js starter in Firebase Studio, adapted for the BookDoc project.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project connects to Sanity.io. You need to set up environment variables for it to work.

1.  Create a file named `.env.local` in the root of your project.
2.  Copy the contents of `.env.local.example` into `.env.local`.
3.  Replace the placeholder values with your actual Sanity project ID, dataset, API version, and API token.
4.  **Important: Restart your Next.js development server after creating or modifying the `.env.local` file.** Environment variables are loaded at build time or server start.

**Example `.env.local` content (also see `.env.local.example`):**
```
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="your_dataset_name" # e.g., "production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-05-13" # Use a recent API version date, like YYYY-MM-DD
SANITY_API_TOKEN="your_sanity_api_token_with_write_permissions"
SANITY_WEBHOOK_SECRET="your_webhook_secret_if_using_webhooks" # Optional
```

**Important Notes:**
- `NEXT_PUBLIC_` prefixed variables are accessible on the client-side (Project ID, Dataset, API Version).
- `SANITY_API_TOKEN` is for server-side use only (e.g., in Server Actions for writing data) and should **not** be prefixed with `NEXT_PUBLIC_`. This token needs write permissions for your Sanity dataset.
- Make sure `.env.local` is included in your `.gitignore` file to prevent committing your secrets.

## Sanity Schema
This project expects the following Sanity schemas to be defined in your Sanity Studio:
- `user`
- `role`
- `physician`
- `booking`

Refer to `src/sanity/schemas/` for the expected structure of these schemas. You will need to add these schema definitions to your Sanity Studio project.
