import { createClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

// Single client scoped to the `heartless` schema for PostgREST `.from()` queries.
// The `db.schema` setting only scopes data queries; `auth.*` and `storage.*` are
// unaffected, so this one client safely handles auth, storage, and data.
export const supabase = createClient(url, anonKey, {
  db: { schema: 'heartless' },
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});
