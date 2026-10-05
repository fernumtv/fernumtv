"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "./client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Get current active session
      supabase.auth
        .getSession()
        .then(({ data }) => {
          setSession(data?.session ?? null);
          setUser(data?.session?.user ?? null);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });

      // Listen for auth state changes
      const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      });
      unsubscribe = () => {
        try {
          data?.subscription?.unsubscribe();
        } catch {}
      };
    } catch {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: Boolean(user),
  };
}
