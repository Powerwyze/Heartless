# Firebase → Supabase Migration Notes

The Heartless app was migrated from Firebase (Auth + Firestore + Storage) to
Supabase (Auth + Postgres + Storage). The migration is **service-layer only** —
all public service-function signatures are unchanged, so `App.tsx`, components,
`types.ts`, `constants.tsx`, and `geminiService.ts` were not modified.

## Files changed

### Added
- `src/config/supabase.ts` — single Supabase client scoped to the `heartless`
  schema via `db: { schema: 'heartless' }`. Used for auth, storage, and data
  (the schema setting only scopes `.from()` calls; auth/storage are unaffected).

### Removed
- `src/config/firebase.ts` — replaced by `supabase.ts`.
- `firestore.rules`, `storage.rules`, `firebase.json`, `.firebaserc` — Firebase-only.

### Modified
- `package.json` — removed `firebase`, added `@supabase/supabase-js@^2`.
- `services/authService.ts` — rewritten on `supabase.auth`; same exports/signatures.
- `services/firestoreService.ts` — rewritten on Supabase Postgres (`heartless`
  schema); snake_case ↔ camelCase row mappers; nested selects for traits/
  preferences/interaction_logs; checklist stored in `partners.date_checklist`
  JSONB; realtime subscriptions via `postgres_changes` channels that re-fetch.
- `services/storageService.ts` — rewritten on the `heartless-sprites` bucket.
- `README.md` — replaced Firebase section with Supabase + Gemini setup/env vars.

## Caveats

- **Account deletion is partial.** The anon Supabase JS client cannot delete the
  `auth.users` row. `deleteAccount()` now deletes all of the user's data rows
  (via `deleteUserData`) and signs the user out. Fully removing the auth user
  requires a service-role admin call (e.g. a future Supabase Edge Function).
  `deleteAccount()` intentionally does not throw.
- **`getCurrentUser()` stays synchronous** by caching the session in a
  module-level variable, primed at module load and kept current by
  `onAuthStateChange`. The returned object is the raw Supabase `User` (matching
  the previous Firebase `User | null` shape closely enough for existing callers).
- **`onAuthStateChange` fires once on subscribe** with the current session to
  mirror Firebase behaviour that App.tsx relies on.
- **Realtime subscriptions re-fetch** the full partner list on any change to
  partners/traits/preferences/interaction_logs (simpler and correct). Realtime
  must be enabled for the `heartless` tables in the Supabase dashboard for live
  updates; CRUD still works without it.
- **Child-row deletes rely on FK cascade** (deleting a partner removes its
  traits/preferences/interaction_logs). Ensure the FKs are defined with
  `ON DELETE CASCADE` in the provisioned schema.
- No dependencies were installed locally — `package.json` was updated only; the
  Vercel build runs `npm install`.

## Required Vercel environment variables

- `VITE_SUPABASE_URL` — e.g. `https://iabkupefwyvqjnflfcxl.supabase.co`
- `VITE_SUPABASE_ANON_KEY` — the anon/publishable key
- `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` — unchanged from before
