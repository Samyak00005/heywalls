import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

const AuthContext = createContext(undefined);

async function ensureProfile(user) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (data) return data;

  const base = user.email ? user.email.split("@")[0] : "user";
  for (let attempt = 0; attempt < 3; attempt++) {
    const username =
      attempt === 0 ? base : `${base}${Math.floor(Math.random() * 1000)}`;
    const { data: created, error } = await supabase
      .from("profiles")
      .insert({ id: user.id, username })
      .select()
      .single();
    if (created) return created;
    if (error?.code !== "23505") {
      // Not a unique-constraint conflict — no point retrying.
      console.error("Failed to create profile:", error);
      return null;
    }
  }
  return null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    let active = true;
    setProfileLoading(true);
    ensureProfile(session.user).then((p) => {
      if (!active) return;
      setProfile(p);
      setProfileLoading(false);
    });
    return () => {
      active = false;
    };
  }, [session]);

  async function refreshProfile() {
    if (!session?.user) return;
    setProfileLoading(true);
    const p = await ensureProfile(session.user);
    setProfile(p);
    setProfileLoading(false);
  }

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    profileLoading,
    signUp: (email, password, username, displayName) =>
      supabase.auth.signUp({
        email,
        password,
        options:
          username || displayName
            ? { data: { username, display_name: displayName } }
            : undefined,
      }),
    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    resetPassword: (email) =>
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      }),
    updatePassword: (password) => supabase.auth.updateUser({ password }),
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
