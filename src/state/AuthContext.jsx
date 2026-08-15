import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthCtx = createContext(null);

const NOT_CONFIGURED_ERROR = 'auth.notConfigured';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  // True from the moment Supabase redirects the user back with a recovery
  // link until they've set a new password. The app shell uses this to force
  // the reset-password screen regardless of whatever scene was active —
  // this is what completes the "must be able to actually set a new
  // password" requirement, not just send the email.
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || '' } },
    });
    return { error: error ? translateAuthError(error) : null };
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? translateAuthError(error) : null };
  }, []);

  const signInWithMagicLink = useCallback(async (email) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    });
    return { error: error ? translateAuthError(error) : null };
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });
    return { error: error ? translateAuthError(error) : null };
  }, []);

  // Completes the recovery flow: called from the reset-password screen once
  // the user has typed a new password while their recovery session is active.
  const updatePassword = useCallback(async (newPassword) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) setPasswordRecovery(false);
    return { error: error ? translateAuthError(error) : null };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }, []);

  const value = {
    session,
    user: session?.user || null,
    isGuest: !session?.user,
    loading,
    isSupabaseConfigured,
    passwordRecovery,
    signUp,
    signIn,
    signInWithMagicLink,
    resetPassword,
    updatePassword,
    signOut,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Returns an i18n KEY, not a message — components render it with t() so the
// same error reads correctly in whichever language is active. See
// src/i18n/ar.js & en.js -> auth.errors.
function translateAuthError(error) {
  const msg = error?.message || '';
  if (msg.includes('already registered')) return 'auth.errors.alreadyRegistered';
  if (msg.includes('Invalid login credentials')) return 'auth.errors.invalidCredentials';
  if (msg.includes('Password should be')) return 'auth.errors.passwordTooShort';
  if (msg.includes('rate limit')) return 'auth.errors.rateLimit';
  return 'auth.errors.unexpected';
}
