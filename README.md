<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1JMPPuCtwK06sFNSYWlI9hcEdaZ2giPHe

## Run Locally

**Prerequisites:**  Node.js, a Supabase project, and a Gemini API key.

1. Install dependencies:
   `npm install`
2. Create a `.env.local` with the following environment variables:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon/publishable key
   - `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` — your Gemini API key
3. Run the app:
   `npm run dev`

This app uses [Supabase](https://supabase.com) for Auth, Postgres (the `heartless`
schema), and Storage (the `heartless-sprites` bucket), and the Gemini API for
sprite/content generation.
