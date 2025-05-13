# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project connects to Sanity.io. You need to set up environment variables for it to work.

1.  Create a file named `.env.local` in the root of your project.
2.  Copy the contents of `.env.local.example` into `.env.local`.
3.  Replace the placeholder values with your actual Sanity project ID, dataset, API version, and API token (if you plan to use server-side mutations).

Example `.env.local` content:
```
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="your_dataset_name"
NEXT_PUBLIC_SANITY_API_VERSION="2023-10-01" # Use a recent API version date
SANITY_API_TOKEN="your_sanity_api_token_for_server_actions_if_needed"
```

**Important:**
- `NEXT_PUBLIC_` prefixed variables are accessible on the client-side.
- `SANITY_API_TOKEN` is for server-side use only (e.g., in Server Actions for writing data) and should **not** be prefixed with `NEXT_PUBLIC_`.
- Make sure `.env.local` is included in your `.gitignore` file to prevent committing your secrets.
