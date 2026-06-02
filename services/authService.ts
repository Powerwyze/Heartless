import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../src/config/supabase';
import { deleteUserData } from './firestoreService';

export interface AuthUser {
  uid: string;
  email: string | null;
}

// Module-level cache of the latest session so getCurrentUser() can stay synchronous
// (Firebase's auth.currentUser was synchronous; Supabase v2 getSession() is async).
let cachedSession: Session | null = null;

// Prime the cache on module load (fire-and-forget) and keep it in sync afterwards.
supabase.auth.getSession().then(({ data }) => {
  cachedSession = data.session;
});
supabase.auth.onAuthStateChange((_event, session) => {
  cachedSession = session;
});

const toAuthUser = (user: User): AuthUser => ({
  uid: user.id,
  email: user.email ?? null,
});

export const signUp = async (email: string, password: string): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('Error signing up:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
  if (!data.user) {
    throw new Error('Failed to sign up');
  }
  return toAuthUser(data.user);
};

export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
  if (!data.user) {
    throw new Error('Failed to sign in');
  }
  return toAuthUser(data.user);
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Deletes the current user's data and signs them out.
 *
 * NOTE: The anon Supabase JS client cannot delete the `auth.users` row itself —
 * that requires a service-role admin call (e.g. a future Edge Function). For now
 * we remove all of the user's data rows and sign them out. This intentionally does
 * not throw so the sign-out flow always completes.
 */
export const deleteAccount = async (): Promise<void> => {
  try {
    const user = cachedSession?.user;
    if (user) {
      await deleteUserData(user.id);
    }
  } catch (error) {
    console.error('Error deleting user data:', error);
  }
  await supabase.auth.signOut();
};

export const getCurrentUser = (): User | null => {
  return cachedSession?.user ?? null;
};

export const onAuthStateChange = (callback: (user: AuthUser | null) => void): () => void => {
  // Fire once immediately with the current session to mirror Firebase's behaviour
  // (which invokes the callback on subscribe with the current user).
  supabase.auth.getSession().then(({ data }) => {
    cachedSession = data.session;
    callback(data.session?.user ? toAuthUser(data.session.user) : null);
  });

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cachedSession = session;
    callback(session?.user ? toAuthUser(session.user) : null);
  });

  return () => {
    data.subscription.unsubscribe();
  };
};
